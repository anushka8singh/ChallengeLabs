import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, AlertCircle, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getChallengeBySlug } from '../services/challengeService';
import type { ChallengeDetail } from '../services/challengeService';
import {
  startSession,
  stopSession,
  getCurrentSession,
} from '../services/sessionService';
import ConfirmationModal from '../components/common/ConfirmationModal';
import DifficultyBadge from '../components/challenges/DifficultyBadge';
import TaskChecklist from '../components/challenges/TaskChecklist';




const ChallengeDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingLab, setStartingLab] = useState(false);
const [showSessionModal, setShowSessionModal] = useState(false);

const [currentLabTitle, setCurrentLabTitle] = useState("");

const [pendingChallengeId, setPendingChallengeId] =
  useState<string | null>(null);
const [resumeSessionId, setResumeSessionId] =
  useState<string | null>(null);

  const handleStartLab = async () => {
    if (resumeSessionId) {
  navigate(`/lab/${resumeSessionId}`);
  return;
}
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

    const current =
      await getCurrentSession();

    if (current.success && current.data) {

      setCurrentLabTitle(
        current.data.challenge?.title ??
        "Unknown Challenge"
      );

      setPendingChallengeId(challenge.id);

      setShowSessionModal(true);

      return;

    }

  } catch {

    toast.error(
      "Unable to load current session."
    );

    return;

  }

}

  toast.error(msg ?? 'Failed to start lab session. Please try again.');
}finally {
      setStartingLab(false);
    }
  };


  const handleConfirmStartNewLab =
  async () => {

    if (!pendingChallengeId) return;

    try {

      setStartingLab(true);

      try {
        await stopSession();
      } catch (err: any) {
        if (err?.response?.status !== 404) {
          throw err;
        }
      }

      const res =
        await startSession(
          pendingChallengeId
        );

      toast.success(
        "Lab started."
      );

      navigate(
        `/lab/${res.data.session.id}`,
        {
          state: {
            expiresAt:
              res.data.expiresAt,
            status:
              res.data.session.status,
          },
        }
      );

    } catch (err: any) {

      toast.error(
        err?.response?.data?.message ??
        "Unable to start lab."
      );

    } finally {

      setShowSessionModal(false);
      setPendingChallengeId(null);
      setStartingLab(false);

    }
};

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getChallengeBySlug(slug)
      .then(async (res) => {

  if (!res.success) {
    setError("Challenge not found.");
    return;
  }

  setChallenge(res.data);

  try {
  const current = await getCurrentSession();

  if (
    current.success &&
    current.data &&
    current.data.challenge?.id === res.data.id
  ) {
    setResumeSessionId(current.data.id);
  } else {
    setResumeSessionId(null);
  }
} catch {
  setResumeSessionId(null);
}

})
      .catch((err: any) => {
  if (err?.response?.status === 403) {
    setError("Premium challenge. Upgrade required.");
  } else if (err?.response?.status === 404) {
    setError("Challenge not found.");
  } else {
    setError("Could not load this challenge.");
  }
})
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
          className={
  resumeSessionId
    ? "btn-resume-lab"
    : "btn-start-lab"
}
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
  {resumeSessionId ? "Resume Lab" : "Start Lab"}
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

      <ConfirmationModal
  isOpen={showSessionModal}
  title="Active Lab Session"
  currentLabTitle={currentLabTitle}
  description="You can only run one challenge at a time. Starting this challenge will automatically stop your current lab session."
  confirmText="Stop & Start New Lab"
  cancelText="Cancel"
  loading={startingLab}
  onCancel={() => {
    setShowSessionModal(false);
    setPendingChallengeId(null);
  }}
  onConfirm={handleConfirmStartNewLab}
/>
    </div>
  );
};

export default ChallengeDetailsPage;
