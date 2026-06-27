import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Trophy } from 'lucide-react';

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
  checkSessionConflict,
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
      <div
        style={{
          marginBottom: 28,
        }}
      >
        <h2 className="dashboard-welcome-title">
          Completed Challenges
        </h2>

        <p className="dashboard-welcome-sub">
          You have completed{' '}
          <strong>
            {completedCount}
          </strong>{' '}
          challenge
          {completedCount !== 1
            ? 's'
            : ''}
          .
        </p>
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
        completedChallenges.length ===
          0 && (
          <div className="empty-state">
            <Trophy
              size={42}
              style={{
                marginBottom: 12,
              }}
            />

            <p className="empty-state-title">
              No completed challenges yet
            </p>

            <p className="empty-state-sub">
              Finish your first lab to
              unlock it here.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        completedChallenges.length >
          0 && (
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