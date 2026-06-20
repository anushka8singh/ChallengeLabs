import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { getChallenges } from '../services/challengeService';
import type { Challenge } from '../services/challengeService';
import ChallengeCard from '../components/challenges/ChallengeCard';

type Difficulty = 'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

const FILTERS: { label: string; value: Difficulty }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Beginner', value: 'BEGINNER' },
  { label: 'Intermediate', value: 'INTERMEDIATE' },
  { label: 'Advanced', value: 'ADVANCED' },
];

const ChallengePage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Difficulty>('ALL');

  useEffect(() => {
    setLoading(true);
    getChallenges()
      .then((res) => {
        if (res.success) setChallenges(res.data);
        else setError('Failed to load challenges.');
      })
      .catch(() => setError('Could not connect to the server. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = challenges.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filter === 'ALL' || c.difficulty === filter;
    return matchSearch && matchDiff;
  });

  return (
    <div className="challenges-page">
      {/* Filters Bar */}
      <div className="challenges-toolbar">
        <div className="search-wrapper">
          <Search size={15} className="search-icon" />
          <input
            id="challenge-search"
            type="text"
            className="search-input"
            placeholder="Search challenges…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <SlidersHorizontal size={15} className="text-secondary" />
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              id={`filter-${value.toLowerCase()}`}
              className={`filter-btn ${filter === value ? 'filter-btn--active' : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {!loading && !error && (
        <p className="results-count">
          {filtered.length} challenge{filtered.length !== 1 ? 's' : ''}
          {filter !== 'ALL' && ` · ${filter.charAt(0) + filter.slice(1).toLowerCase()}`}
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="challenges-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card skeleton-card--tall" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="error-state">
          <AlertCircle size={20} className="text-error" />
          <p>{error}</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <p className="empty-state-title">No challenges found</p>
          <p className="empty-state-sub">Try adjusting your search or filters.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="challenges-grid">
          {filtered.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengePage;
