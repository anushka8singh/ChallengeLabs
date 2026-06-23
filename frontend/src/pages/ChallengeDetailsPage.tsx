import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, AlertCircle, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getChallengeBySlug } from '../services/challengeService';
import type { ChallengeDetail } from '../services/challengeService';
import { startSession, getCurrentSession } from '../services/sessionService';
import DifficultyBadge from '../components/challenges/DifficultyBadge';
import TaskChecklist from '../components/challenges/TaskChecklist';

const ChallengeDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingLab, setStartingLab] = useState(false);

  const handleStartLab = async () => {
    if (!challenge || startingLab) return;
    setStartingLab(true);
    try {
      const res = await startSession(challenge.id);
      if (res.success) {
        toast.success('Lab session started!');
        navigate(`/lab/${res.data.session.id}`, {
          state: {
            expiresAt: res.data.expiresAt,
            status: res.data.session.status,
          },
        });
      } else {
        toast.error('Failed to start lab session.');
      }
    } catch (err) {
  const axiosErr = err as {
    response?: {
      status?: number;
      data?: {
        message?: string;
      };
    };
  };

  const status = axiosErr?.response?.status;
  const msg = axiosErr?.response?.data?.message;

  // Active session already exists
  if (status === 409) {
    try {
      const current = await getCurrentSession();

      if (current.success && current.data) {
        toast.success('Resuming existing lab session...');

        navigate(`/lab/${current.data.id}`, {
          state: {
            expiresAt: current.data.expiresAt,
            status: current.data.status,
          },
        });

        return;
      }
    } catch {
      toast.error('Could not resume existing session.');
      return;
    }
  }

  toast.error(msg ?? 'Failed to start lab session. Please try again.');
}finally {
      setStartingLab(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getChallengeBySlug(slug)
      .then((res) => {
        if (res.success) setChallenge(res.data);
        else setError('Challenge not found.');
      })
      .catch(() => setError('Could not load this challenge. Please try again.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-skeleton">
          <div className="skeleton-line skeleton-line--short" />
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--medium" />
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="detail-page">
        <div className="error-state">
          <AlertCircle size={20} className="text-error" />
          <p>{error ?? 'Challenge not found.'}</p>
          <button className="btn-secondary" onClick={() => navigate('/challenges')}>
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      {/* Back */}
      <button
        className="back-btn"
        onClick={() => navigate('/challenges')}
      >
        <ArrowLeft size={15} />
        Back to Challenges
      </button>

      {/* Header */}
      <div className="detail-header">
        <div className="detail-meta">
          <DifficultyBadge difficulty={challenge.difficulty} />
          <span className="detail-time">
            <Clock size={14} />
            {challenge.estimatedMinutes} min estimated
          </span>
        </div>
        <h1 className="detail-title">{challenge.title}</h1>
        {challenge.description && (
          <p className="detail-description">{challenge.description}</p>
        )}

        {/* Start Lab CTA */}
        <button
          id="start-lab-btn"
          className="btn-start-lab"
          onClick={handleStartLab}
          disabled={startingLab}
        >
          {startingLab ? (
            <>
              <span className="btn-spinner" />
              Starting Lab...
            </>
          ) : (
            <>
              <PlayCircle size={18} />
              Start Lab
            </>
          )}
        </button>
      </div>

      {/* Tasks */}
      {challenge.tasks && challenge.tasks.length > 0 && (
        <div className="detail-section">
          <h2 className="detail-section-title">
            Tasks
            <span className="detail-section-count">{challenge.tasks.length}</span>
          </h2>
          <TaskChecklist tasks={challenge.tasks} />
        </div>
      )}
    </div>
  );
};

export default ChallengeDetailsPage;
