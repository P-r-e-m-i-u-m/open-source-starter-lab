const graphqlEndpoint = "https://api.github.com/graphql";

interface DiscussionCategory {
  id: string;
  name: string;
  slug: string;
}

interface DiscussionNode {
  title: string;
  url: string;
}

interface RepositoryQuery {
  repository: {
    id: string;
    discussionCategories: {
      nodes: DiscussionCategory[];
    };
    discussions: {
      nodes: DiscussionNode[];
    };
  };
}

interface CreateDiscussionMutation {
  createDiscussion: {
    discussion: DiscussionNode;
  };
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function getWeekStart(date = new Date()): Date {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utcDate.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  utcDate.setUTCDate(utcDate.getUTCDate() + diff);
  return utcDate;
}

function buildTitle(date = new Date()): string {
  return `Who needs help this week? First PR support - ${formatDate(getWeekStart(date))}`;
}

function buildBody(): string {
  return [
    "New to open source? Drop a comment here and I will suggest a small issue for your skill level.",
    "",
    "Comment with this:",
    "",
    "```md",
    "I know:",
    "I want to practice:",
    "I have time for: 15 min / 30 min / 1 hour",
    "I am stuck on:",
    "```",
    "",
    "Good paths to ask for:",
    "",
    "- HTML/CSS first issue",
    "- JavaScript or TypeScript first issue",
    "- Python beginner issue",
    "- Docs-only issue",
    "- Testing issue",
    "- Git and pull request workflow help",
    "",
    "I will reply with one issue, the first command to run, and what your pull request should prove.",
    "",
    "If you already opened a PR, link it here too. I will help you get it review-ready."
  ].join("\n");
}

async function githubGraphql<T>(token: string, query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub GraphQL failed ${response.status}: ${text}`);
  }

  const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  if (!payload.data) {
    throw new Error("GitHub GraphQL returned no data.");
  }

  return payload.data;
}

async function getRepositoryData(owner: string, repo: string, token: string): Promise<RepositoryQuery> {
  return githubGraphql<RepositoryQuery>(
    token,
    `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          id
          discussionCategories(first: 20) {
            nodes {
              id
              name
              slug
            }
          }
          discussions(first: 30, orderBy: { field: CREATED_AT, direction: DESC }) {
            nodes {
              title
              url
            }
          }
        }
      }
    `,
    { owner, repo }
  );
}

async function createDiscussion(
  repositoryId: string,
  categoryId: string,
  title: string,
  body: string,
  token: string
): Promise<DiscussionNode> {
  const result = await githubGraphql<CreateDiscussionMutation>(
    token,
    `
      mutation($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
        createDiscussion(input: {
          repositoryId: $repositoryId,
          categoryId: $categoryId,
          title: $title,
          body: $body
        }) {
          discussion {
            title
            url
          }
        }
      }
    `,
    { repositoryId, categoryId, title, body }
  );

  return result.createDiscussion.discussion;
}

async function main(): Promise<void> {
  const title = buildTitle();
  const body = buildBody();

  if (hasFlag("--dry-run")) {
    console.log(`# ${title}`);
    console.log("");
    console.log(body);
    return;
  }

  const repository = requireEnv("GITHUB_REPOSITORY");
  const token = process.env.GITHUB_TOKEN || process.env.MAINTAINER_TOKEN;
  const [owner, repo] = repository.split("/");

  if (!token) {
    throw new Error("Missing GITHUB_TOKEN or MAINTAINER_TOKEN.");
  }

  if (!owner || !repo) {
    throw new Error(`Invalid GITHUB_REPOSITORY value: ${repository}`);
  }

  const data = await getRepositoryData(owner, repo, token);
  const category =
    data.repository.discussionCategories.nodes.find((node) => node.slug === "q-a") ??
    data.repository.discussionCategories.nodes.find((node) => node.name.toLowerCase() === "q&a");

  if (!category) {
    throw new Error("Could not find the Q&A discussion category.");
  }

  const existing = data.repository.discussions.nodes.find((discussion) => discussion.title === title);
  if (existing) {
    console.log(`Weekly help discussion already exists: ${existing.url}`);
    return;
  }

  const discussion = await createDiscussion(data.repository.id, category.id, title, body, token);
  console.log(`Created weekly help discussion: ${discussion.url}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
