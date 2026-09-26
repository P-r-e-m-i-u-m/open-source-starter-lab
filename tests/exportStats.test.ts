import { exportStats } from '../src/plugins/exportStats';

describe('exportStats', () => {
  it('should log "Not implemented yet."', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    exportStats();
    expect(consoleSpy).toHaveBeenCalledWith('Not implemented yet.');
    consoleSpy.mockRestore();
  });
});
