import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getChallenges } from '../services/challengeService';
import type { Challenge } from '../services/challengeService';
import DifficultyBadge from '../components/challenges/DifficultyBadge';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChallenges()
      .then((res) => res.success && setChallenges(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: 'Total Challenges',
      value: loading ? '—' : challenges.length,
      icon: BookOpen,
      color: 'stat-icon--purple',
    },
    {
      label: 'Beginner',
      value: loading ? '—' : challenges.filter((c) => c.difficulty === 'BEGINNER').length,
      icon: TrendingUp,
      color: 'stat-icon--green',
    },
    {
      label: 'Intermediate',
      value: loading ? '—' : challenges.filter((c) => c.difficulty === 'INTERMEDIATE').length,
      icon: TrendingUp,
      color: 'stat-icon--yellow',
    },
    {
      label: 'Advanced',
      value: loading ? '—' : challenges.filter((c) => c.difficulty === 'ADVANCED').length,
      icon: TrendingUp,
      color: 'stat-icon--red',
    },
  ];

  const recent = challenges.slice(0, 4);

  return (
    <div className="dashboard-page">
      {/* Welcome */}
      <div className="dashboard-welcome">
        <h2 className="dashboard-welcome-title">
          Welcome back, <span className="text-accent">{user?.name?.split(' ')[0] ?? 'there'}</span> 👋
        </h2>
        <p className="dashboard-welcome-sub">
          Pick up where you left off or explore new challenges.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className={`stat-icon ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="stat-value">{value}</p>
              <p className="stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Challenges */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h3 className="dashboard-section-title">Available Challenges</h3>
          <button
            className="dashboard-section-link"
            onClick={() => navigate('/challenges')}
          >
            View all <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : (
          <div className="recent-challenges-grid">
            {recent.map((c) => (
              <div
                key={c.id}
                className="recent-card"
                onClick={() => navigate(`/challenges/${c.slug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/challenges/${c.slug}`)}
              >
                <div className="recent-card-header">
                  <DifficultyBadge difficulty={c.difficulty} />
                  <span className="recent-card-time">
                    <Clock size={12} /> {c.estimatedMinutes}m
                  </span>
                </div>
                <p className="recent-card-title">{c.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
