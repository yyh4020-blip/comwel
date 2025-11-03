import { INTENTS } from './intents';

describe('INTENTS dictionary', () => {
  it('includes all expected voice intents', () => {
    const intentIds = INTENTS.map((intent) => intent.id);
    expect(intentIds).toContain('fund_seed_apply');
    expect(intentIds).toContain('form_library');
    expect(INTENTS.length).toBeGreaterThanOrEqual(18);
  });
});
