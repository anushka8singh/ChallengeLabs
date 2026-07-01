import { Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Challenge } from '../../services/challengeService';
import DifficultyBadge from './DifficultyBadge';

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="challenge-card"
      onClick={() => navigate(`/challenges/${challenge.slug}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/challenges/${challenge.slug}`)}
    >
      <div className="challenge-card-header">
        <DifficultyBadge difficulty={challenge.difficulty} />
        <div className="challenge-card-time">
          <Clock size={13} />
          <span>{challenge.estimatedMinutes} min</span>
        </div>
      </div>
      <h3 className="challenge-card-title">{challenge.title}</h3>
      <div className="challenge-card-footer">
        <span className="challenge-card-arrow">
          View challenge <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
};

export default ChallengeCard;
