import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Layers, Plus, Edit, Trash2 } from 'lucide-react';
import DifficultyBadge from '../components/challenges/DifficultyBadge';
import {
  getAdminChallenges,
  type AdminChallenge,
} from '../services/adminService';
import toast from 'react-hot-toast';
import { deleteChallenge } from '../services/adminService';


const AdminDashboardPage = () => {
    const navigate = useNavigate();
  const [challenges, setChallenges] =
    useState<AdminChallenge[]>([]);

  const [loading, setLoading] =
    useState(true);
const handleDelete = async (
  challengeId: string
) => {
  try {
    await deleteChallenge(challengeId);

    setChallenges((prev) =>
      prev.filter(
        (c) => c.id !== challengeId
      )
    );

    toast.success(
      'Challenge deleted'
    );
  } catch {
    toast.error(
      'Failed to delete challenge'
    );
  }
};
  useEffect(() => {
    getAdminChallenges()
      .then((res) => {
        if (res.success) {
          setChallenges(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="error-state">
        <div className="btn-spinner" style={{ width: '24px', height: '24px' }} />
        <p style={{ marginTop: '12px' }}>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <h2 className="dashboard-welcome-title">
          Admin <span className="text-accent">Dashboard</span>
        </h2>
        <p className="dashboard-welcome-sub">
          Manage challenges, configure environments, and design tasks.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon--purple">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="stat-value">{challenges.length}</p>
            <p className="stat-label">Total Challenges</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--green">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="stat-value">
              {challenges.filter((c) => c.isPublished).length}
            </p>
            <p className="stat-label">Published</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--yellow">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="stat-value">
              {challenges.filter((c) => !c.isPublished).length}
            </p>
            <p className="stat-label">Drafts</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h3 className="dashboard-section-title">Challenges</h3>
          <button
            onClick={() => navigate('/admin/challenges/new')}
            className="btn-primary"
          >
            <Plus size={16} /> Create Challenge
          </button>
        </div>

        {challenges.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">No challenges found</p>
            <p className="empty-state-sub">Create your first challenge to get started.</p>
          </div>
        ) : (
          <div className="challenges-grid">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="challenge-card" style={{ cursor: 'default' }}>
                <div className="challenge-card-header">
                  <DifficultyBadge difficulty={challenge.difficulty as any} />
                  <span
                    className={`badge ${
                      challenge.isPublished
                        ? 'badge--beginner'
                        : 'badge--intermediate'
                    }`}
                  >
                    {challenge.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <h3 className="challenge-card-title">{challenge.title}</h3>

                <div className="challenge-card-time" style={{ gap: '16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} />
                    {challenge.estimatedMinutes} min
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={13} />
                    {challenge.tasks.length} {challenge.tasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>

                <div className="admin-card-actions">
                  <button
                    onClick={() =>
                      navigate(`/admin/challenges/${challenge.id}/tasks`)
                    }
                    className="btn-primary btn-primary-sm"
                    style={{ flex: 1 }}
                  >
                    Manage Tasks
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/admin/challenges/${challenge.id}/edit`)
                    }
                    className="btn-secondary btn-secondary-sm"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(challenge.id)}
                    className="btn-danger btn-danger-sm"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;