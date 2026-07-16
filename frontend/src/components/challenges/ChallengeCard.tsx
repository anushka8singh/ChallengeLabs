import {
  Clock,
  ArrowRight,
  Crown,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Challenge } from "../../services/challengeService";
import DifficultyBadge from "./DifficultyBadge";

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard = ({
  challenge,
}: ChallengeCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!challenge.hasAccess) return;

    navigate(`/challenges/${challenge.slug}`);
  };

  return (
    <div
      className={`challenge-card challenge-card--v2 ${
        !challenge.hasAccess
          ? "challenge-card--locked"
          : ""
      }`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" &&
        handleClick()
      }
      aria-label={`${challenge.title}${!challenge.hasAccess ? " — Premium Required" : ""}`}
    >
      {/* Header row: difficulty + time + premium badge */}
      <div className="challenge-card-header">
        <DifficultyBadge
          difficulty={challenge.difficulty}
        />

        <div className="cc-header-right">
          {challenge.isPremium && (
            <div className="cc-premium-badge">
              <Crown size={11} />
              Premium
            </div>
          )}

          <div className="challenge-card-time">
            <Clock size={12} />
            <span>
              {challenge.estimatedMinutes} min
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="challenge-card-title cc-title">
        {challenge.title}
      </h3>

      {/* Premium locked indicator */}
      {challenge.isPremium && !challenge.hasAccess && (
        <div className="cc-locked-row">
          <Lock size={12} />
          <span>Premium Required</span>
        </div>
      )}

      {/* Footer */}
      <div className="challenge-card-footer cc-footer">
        {challenge.hasAccess ? (
          <span className="cc-action-link">
            Start Challenge
            <ArrowRight size={14} />
          </span>
        ) : (
          <span className="cc-action-link cc-action-link--locked">
            <Lock size={13} />
            Unlock with Premium
          </span>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;