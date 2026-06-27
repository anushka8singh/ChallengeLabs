import { Clock, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DifficultyBadge from './DifficultyBadge';

export interface CompletedChallenge {
  challengeId: string;
  title: string;
  slug: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedMinutes: number;
  completedAt: string;
  attempts: number;
}

interface Props {
  challenge: CompletedChallenge;
  onRetry: (challenge: CompletedChallenge) => void;
}

const CompletedChallengeCard = ({
  challenge,
  onRetry,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div className="challenge-card">
      <div className="challenge-card-header">
        <DifficultyBadge difficulty={challenge.difficulty} />

        <div className="challenge-card-time">
          <Clock size={13} />
          <span>{challenge.estimatedMinutes} min</span>
        </div>
      </div>

      <h3 className="challenge-card-title">
        {challenge.title}
      </h3>

      <div
        style={{
          marginTop: 12,
          marginBottom: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          color: 'var(--text-secondary)',
          fontSize: '14px',
        }}
      >
        <span>
          <strong>Completed:</strong>{' '}
          {new Date(challenge.completedAt).toLocaleDateString()}
        </span>

        <span>
          <strong>Attempts:</strong> {challenge.attempts}
        </span>
      </div>

      <div className="completed-actions">
        

        <button
    className="btn-primary completed-retry-btn"
    onClick={() => onRetry(challenge)}
>
    <RotateCcw size={15} />
    Retry Challenge
</button>
      </div>
    </div>
  );
};

export default CompletedChallengeCard;