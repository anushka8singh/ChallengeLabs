import { Clock, RotateCcw, Calendar, CheckCircle, RefreshCw } from 'lucide-react';
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

  const completedDate = new Date(challenge.completedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

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

      {/* Success indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span className="completed-success-indicator">
          <CheckCircle size={11} />
          Completed
        </span>
      </div>

      {/* Meta info */}
      <div className="completed-card-meta">
        <div className="completed-card-meta-row">
          <Calendar size={13} className="completed-card-meta-icon" />
          <span>{completedDate}</span>
        </div>
        <div className="completed-card-meta-row">
          <RefreshCw size={13} className="completed-card-meta-icon" />
          <span>{challenge.attempts} attempt{challenge.attempts !== 1 ? 's' : ''}</span>
        </div>
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