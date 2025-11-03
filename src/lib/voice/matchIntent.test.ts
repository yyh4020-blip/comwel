import { matchIntent } from './matchIntent';

describe('matchIntent', () => {
  it('matches retire payout intent for natural sentence', () => {
    const { intentId } = matchIntent('퇴직금 지급 신청하고 싶어요');
    expect(intentId).toBe('retire_payout_apply');
  });

  it('matches online status intent for request', () => {
    const { intentId } = matchIntent('온라인 신청 현황 보고 싶은데 어떻게 해요?');
    expect(intentId).toBe('online_status');
  });

  it('matches auto transfer intent for colloquial input', () => {
    const result = matchIntent('이체 자동으로 설정해줘');
    expect(result.intentId).toBe('auto_transfer');
    expect(result.score).toBeGreaterThanOrEqual(55);
  });

  it('returns null for unrelated sentence', () => {
    const result = matchIntent('점심 뭐 먹을까');
    expect(result.intentId).toBeNull();
    expect(result.score).toBeLessThan(55);
  });
});
