import { useEffect, useMemo, useState } from 'react';
import { matchIntent } from '@/lib/voice/matchIntent';
import { INTENTS, VoiceIntent } from '@/lib/voice/intents';

type VoiceCommandHandlerProps = {
  transcript: string | null;
  onIntentResolved: (intent: VoiceIntent) => void;
  fallbackMessage?: string;
  idlePrompt?: string;
  threshold?: number;
  debug?: boolean;
};

type HandlerState = 'idle' | 'resolved' | 'fallback';

export function VoiceCommandHandler({
  transcript,
  onIntentResolved,
  fallbackMessage = '무슨 도움을 드리면 될까요? 예: 퇴직금 지급 신청 안내',
  idlePrompt = '음성으로 업무를 말씀해 주세요',
  threshold,
  debug = false,
}: VoiceCommandHandlerProps) {
  const [status, setStatus] = useState<HandlerState>('idle');
  const [message, setMessage] = useState(idlePrompt);
  const [lastReason, setLastReason] = useState<string | null>(null);

  useEffect(() => {
    if (!transcript || !transcript.trim()) {
      setStatus('idle');
      setMessage(idlePrompt);
      setLastReason(null);
      return;
    }

    const result = matchIntent(transcript, {
      threshold,
      intents: INTENTS,
    });

    setLastReason(result.reason);

    if (result.intent) {
      setStatus('resolved');
      setMessage(`${result.intent.displayName} 안내를 열었어요.`);
      onIntentResolved(result.intent);
    } else {
      setStatus('fallback');
      setMessage(fallbackMessage);
    }
  }, [transcript, threshold, fallbackMessage, idlePrompt, onIntentResolved]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'resolved':
        return '안내 중';
      case 'fallback':
        return '다시 말씀해 주세요';
      default:
        return '대기 중';
    }
  }, [status]);

  return (
    <div aria-live="polite">
      <p>
        <strong>{statusLabel}</strong> {message}
      </p>
      {debug && lastReason && (
        <p style={{ fontSize: '0.8rem', color: '#666' }}>debug: {lastReason}</p>
      )}
    </div>
  );
}
