import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Trophy, Star } from 'lucide-react';

import {
  getCompletedChallenges,
  startSession,
} from '../services/sessionService';

import CompletedChallengeCard, {
  CompletedChallenge,
} from '../components/challenges/CompletedChallengeCard';
import toast from "react-hot-toast";
import ConfirmationModal from "../components/common/ConfirmationModal";

import {
  stopSession,
} from "../services/sessionService";

const CompletedChallengesPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [completedChallenges, setCompletedChallenges] =
    useState<CompletedChallenge[]>([]);

  const [selectedChallenge, setSelectedChallenge] =
    useState<CompletedChallenge | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [retryLoading, setRetryLoading] =
    useState(false);

  const [completedCount, setCompletedCount] =
    useState(0);

  useEffect(() => {
    getCompletedChallenges()
      .then((res) => {
        if (res.success) {
          setCompletedChallenges(
            res.data.completedChallenges
          );

          setCompletedCount(
            res.data.stats.completed
          );
        }
      })
      .catch(() =>
        setError(
          'Unable to load completed challenges.'
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const handleRetry = async (
    challenge: CompletedChallenge
  ) => {
    setSelectedChallenge(challenge);
    setShowModal(true);
  };

  const handleConfirmRetry = async () => {

    if (!selectedChallenge) return;

    try {
      setRetryLoading(true);

      // Try stopping an existing session.
      // Ignore "No active session found".
      try {
        await stopSession();
      } catch (err: any) {
        if (err?.response?.status !== 404) {
          throw err;
        }
      }

      const res = await startSession(
        selectedChallenge.challengeId
      );

      toast.success("Challenge started.");

      navigate(`/lab/${res.data.session.id}`, {
        state: {
          expiresAt: res.data.expiresAt,
          status: res.data.session.status,
        },
      });

    } catch (err: any) {

      toast.error(
        err?.response?.data?.message ??
        "Unable to start challenge."
      );

    } finally {

      setRetryLoading(false);
      setShowModal(false);
      setSelectedChallenge(null);

    }
  };

  return (
    <div className="challenges-page">

      {/* Page header */}
      <div className="dashboard-welcome" style={{ padding: '28px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="stat-icon stat-icon--purple" style={{ flexShrink: 0 }}>
            <Trophy size={18} />
          </div>
          <div>
            <h2 className="dashboard-welcome-title" style={{ fontSize: '24px' }}>
              Completed Challenges
            </h2>
            <p className="dashboard-welcome-sub" style={{ marginTop: 0 }}>
              {loading
                ? 'Loading…'
                : `You've completed ${completedCount} challenge${completedCount !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="challenges-grid">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="skeleton-card skeleton-card--tall"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="error-state">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {!loading &&
        !error &&
        completedChallenges.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon-wrap">
              <Star size={28} />
            </div>
            <p className="empty-state-title">
              No completed challenges yet
            </p>
            <p className="empty-state-sub">
              Finish your first lab to unlock it here. Your achievements will be tracked automatically.
            </p>
            <button
              className="dashboard-quick-action dashboard-quick-action--primary"
              style={{ marginTop: '16px' }}
              onClick={() => navigate('/challenges')}
            >
              <Trophy size={15} />
              Start a Challenge
            </button>
          </div>
        )}

      {!loading &&
        !error &&
        completedChallenges.length > 0 && (
          <div className="challenges-grid">
            {completedChallenges.map(
              (challenge) => (
                <CompletedChallengeCard
                  key={
                    challenge.challengeId
                  }
                  challenge={challenge}
                  onRetry={
                    handleRetry
                  }
                />
              )
            )}
          </div>
        )}

      <ConfirmationModal
        isOpen={showModal}
        title="Active Lab Session"
        description="You can only run one challenge at a time. Starting this challenge will automatically stop your current lab session."
        confirmText="Stop & Retry Challenge"
        cancelText="Cancel"
        loading={retryLoading}
        onCancel={() => {
          setShowModal(false);
          setSelectedChallenge(null);
        }}
        onConfirm={handleConfirmRetry}
      />
    </div>
  );
};

export default CompletedChallengesPage;