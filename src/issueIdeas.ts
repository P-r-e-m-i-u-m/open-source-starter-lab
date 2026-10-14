import { issueIdeas } from "../src/issueIdeas.js";

describe("issueIdeas", () => {
  it("should contain a list of issue ideas", () => {
    expect(Array.isArray(issueIdeas)).toBe(true);
    expect(issueIdeas.length).toBeGreaterThan(0);
  });

  it("should have valid structure for each issue idea", () => {
    issueIdeas.forEach((idea) => {
      expect(idea).toHaveProperty("title");
      expect(idea).toHaveProperty("label");
      expect(idea).toHaveProperty("difficulty");
      expect(idea).toHaveProperty("goal");
      expect(idea).toHaveProperty("acceptanceCriteria");

      expect(idea.title).toEqual(expect.any(String));
      expect(idea.label).toEqual(expect.any(String));
      expect(idea.difficulty).toEqual(expect.any(String));
      expect(idea.goal).toEqual(expect.any(String));
      expect(idea.acceptanceCriteria).toEqual(expect.any(Array));
      expect(idea.acceptanceCriteria.length).toBeGreaterThan(0);
    });
  });

  it("should have valid difficulty levels", () => {
    const validDifficulties = ["easy", "medium"];
    issueIdeas.forEach((idea) => {
      expect(validDifficulties).toContain(idea.difficulty);
    });
  });

  it("should have specific issue ideas in the list", () => {
    const titles = issueIdeas.map((idea) => idea.title);
    expect(titles).toContain("Add a Windows Git setup guide");
    expect(titles).toContain("Add common first PR mistakes");
    expect(titles).toContain("Add CLI output examples");
  });
});