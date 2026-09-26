import { welcome } from '../src/plugins/welcome';

describe('welcome', () => {
  let consoleLogSpy: jest.SpyOn;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should log the welcome message with contributor name', () => {
    welcome('Alice', 'issue-123');
    expect(consoleLogSpy).toHaveBeenCalledWith('Welcome, Alice!');
  });

  it('should log the claimed issue', () => {
    welcome('Bob', 'issue-456');
    expect(consoleLogSpy).toHaveBeenCalledWith('Your first claimed issue is: issue-456');
  });

  it('should log the closing message', () => {
    welcome('Charlie', 'issue-789');
    expect(consoleLogSpy).toHaveBeenCalledWith("We're glad to have you contributing to Open Source Starter Lab!");
  });

  it('should log all three messages in order', () => {
    welcome('Diana', 'issue-000');
    expect(consoleLogSpy).toHaveBeenCalledTimes(3);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'Welcome, Diana!');
    expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'Your first claimed issue is: issue-000');
    expect(consoleLogSpy).toHaveBeenNthCalledWith(3, "We're glad to have you contributing to Open Source Starter Lab!");
  });
});