type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

const config: Record<Difficulty, { label: string; className: string }> = {
  BEGINNER: { label: 'Beginner', className: 'badge badge--beginner' },
  INTERMEDIATE: { label: 'Intermediate', className: 'badge badge--intermediate' },
  ADVANCED: { label: 'Advanced', className: 'badge badge--advanced' },
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  const { label, className } = config[difficulty] ?? config.BEGINNER;
  return <span className={className}>{label}</span>;
};

export default DifficultyBadge;
