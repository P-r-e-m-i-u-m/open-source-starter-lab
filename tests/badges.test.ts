import { earnedBadges } from '../src/plugins/badges';

describe('earnedBadges', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(() => {
     consoleSpy.mockClear();
  });

  afterAll(() => {
     consoleSpy.mockRestore();
  });

  it('should notify when no badges are earned', () => {
      earnedBadges({ pullRequests: 0, docsPullRequests: 0 });
      expect(consoleSpy).toHaveBeenCalledWith('No badges earned yet. Open a pull request to earn your first!');
  });

  it('should earn "First PR" badge when 1 pull request is made', () => {
      earnedBadges({ pullRequests: 1, docsPullRequests: 0 });
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('First PR'));
  });

  it('should earn "Five PRs" badge when 5 pull requests are made', () => {
      earnedBadges({ pullRequests: 5, docsPullRequests: 0 });
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Five PRs'));
  });

  it('should earn "Docs Contributor" badge when 1 doc pull request is made', () => {
      earnedBadges({ pullRequests: 0, docsPullRequests: 1 });
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Docs Contributor'));
  });

  it('should earn multiple badges when criteria are met', () => {
      earnedBadges({ pullRequests: 5, docsPullRequests: 1 });
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('First PR'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Five PRs'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Docs Contributor'));
  });
});
