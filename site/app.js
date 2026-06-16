const routes = {
  docs: {
    15: {
      title: "15 minute docs task",
      copy: "Make one quick guide, wording, or link improvement.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22time%3A+15+min%22+label%3Adocumentation+no%3Aassignee"
    },
    30: {
      title: "30 minute docs task",
      copy: "Improve one guide, example, or checklist with a focused PR.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22time%3A+30+min%22+label%3Adocumentation+no%3Aassignee"
    },
    60: {
      title: "1 hour docs plus proof task",
      copy: "Add a stronger guide and connect it to the contributor workflow.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3Adocumentation+label%3A%22level%3A+second-pr%22+no%3Aassignee"
    }
  },
  git: {
    15: {
      title: "Quick Git help task",
      copy: "Improve one Git command explanation for first-time contributors.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22skill%3A+git%22+no%3Aassignee"
    },
    30: {
      title: "Git beginner workflow task",
      copy: "Add or improve a safe branch, pull, or PR workflow guide.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22skill%3A+git%22+label%3A%22time%3A+30+min%22+no%3Aassignee"
    },
    60: {
      title: "Git second PR route",
      copy: "Make a deeper workflow improvement with proof and clear examples.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22skill%3A+git%22+label%3A%22level%3A+second-pr%22+no%3Aassignee"
    }
  },
  javascript: {
    15: {
      title: "Small CLI wording task",
      copy: "Improve one command message so beginners know the next action.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3Acli+label%3A%22time%3A+15+min%22+no%3Aassignee"
    },
    30: {
      title: "JavaScript first issue",
      copy: "Change one CLI behavior or output and run the project check.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22skill%3A+javascript%22+no%3Aassignee"
    },
    60: {
      title: "CLI second PR task",
      copy: "Add a small CLI behavior with a matching smoke test.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3Acli+label%3A%22level%3A+second-pr%22+no%3Aassignee"
    }
  },
  testing: {
    15: {
      title: "Quick verification task",
      copy: "Improve one proof checklist or small test note.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3Atesting+label%3A%22time%3A+15+min%22+no%3Aassignee"
    },
    30: {
      title: "Testing first issue",
      copy: "Add one smoke test assertion or verification example.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3Atesting+label%3A%22time%3A+30+min%22+no%3Aassignee"
    },
    60: {
      title: "Testing second PR route",
      copy: "Add a focused test around existing CLI behavior.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3Atesting+label%3A%22level%3A+second-pr%22+no%3Aassignee"
    }
  },
  python: {
    15: {
      title: "Python learner docs task",
      copy: "Improve onboarding language for Python learners entering a TypeScript repo.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/blob/main/docs/PYTHON_LEARNER_FIRST_PR.md"
    },
    30: {
      title: "Python beginner route",
      copy: "Find docs tasks where Python learners can contribute without writing TypeScript.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22skill%3A+python%22+no%3Aassignee"
    },
    60: {
      title: "Python to open-source bridge",
      copy: "Create examples that connect Python habits to GitHub contribution workflows.",
      url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3Adocumentation+label%3A%22level%3A+second-pr%22+no%3Aassignee"
    }
  }
};

const skill = document.querySelector("#skill");
const time = document.querySelector("#time");
const routeTitle = document.querySelector("#routeTitle");
const routeCopy = document.querySelector("#routeCopy");
const routeLink = document.querySelector("#routeLink");

function updateRoute() {
  const selectedSkill = skill.value;
  const selectedTime = time.value;
  const route = routes[selectedSkill][selectedTime];

  routeTitle.textContent = route.title;
  routeCopy.textContent = route.copy;
  routeLink.href = route.url;
}

skill.addEventListener("change", updateRoute);
time.addEventListener("change", updateRoute);
updateRoute();

// --- Live Issue Feed Fetcher ---
async function fetchLiveIssues() {
  const feedElement = document.getElementById("liveIssueFeed");
  if (!feedElement) return;

  try {
    // Fetch issues with the "good first issue" label that are open
    const response = await fetch("https://api.github.com/repos/P-r-e-m-i-u-m/open-source-starter-lab/issues?state=open&labels=good%20first%20issue&sort=created&direction=desc&per_page=5");
    
    if (!response.ok) {
      throw new Error("Failed to fetch issues.");
    }
    
    const issues = await response.json();
    
    // Clear loading state
    feedElement.innerHTML = "<p><span>&gt;</span> fetching open issues from GitHub API...</p><p class=\"terminal-success\">200 OK</p>";
    
    if (issues.length === 0) {
      feedElement.innerHTML += "<p>No open issues found right now. Check back later!</p>";
      return;
    }

    issues.forEach(issue => {
      // Don't show PRs, only issues
      if (issue.pull_request) return;
      
      const title = issue.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const url = issue.html_url;
      const isAssigned = issue.assignees && issue.assignees.length > 0;
      const statusColor = isAssigned ? "terminal-status-magenta" : "terminal-status-cyan";
      const statusText = isAssigned ? "CLAIMED" : "AVAILABLE";

      feedElement.innerHTML += `
        <div style="margin-top: 1rem; border-top: 1px dashed var(--green); padding-top: 0.5rem;">
          <p><span class="${statusColor}">[${statusText}]</span> <a href="${url}" target="_blank" style="color: var(--fg); text-decoration: underline;">#${issue.number} ${title}</a></p>
          <p style="font-size: 0.9em; opacity: 0.8;">> claim by commenting <code>.take</code></p>
        </div>
      `;
    });

  } catch (err) {
    feedElement.innerHTML += `<p class="magenta">Error: ${err.message}</p>`;
  }
}

// Fetch issues on load
document.addEventListener("DOMContentLoaded", fetchLiveIssues);

