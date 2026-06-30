import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  FlaskConical,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  BookOpen,
  Play,
  Trophy,
  Terminal,
  ChevronRight,
  ArrowRight,
  Target,
  Layers,
  BarChart3,
  Shield,
  Circle,
  SquareTerminal,
} from 'lucide-react';

/* ─── Intersection Observer hook for fade-in animations ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ─── Mock Lab Interface (Hero Right Side) ─── */
const MockLabInterface = () => {
  const [progress] = useState(67);
  const tasks = [
    { label: 'Setup environment variables', done: true },
    { label: 'Configure Nginx reverse proxy', done: true },
    { label: 'Deploy containerized app', done: false, active: true },
    { label: 'Validate health endpoints', done: false },
  ];

  return (
    <div className="lp-mock-shell">
      {/* Window chrome */}
      <div className="lp-mock-titlebar">
        <div className="lp-mock-dots">
          <span className="lp-dot lp-dot--red" />
          <span className="lp-dot lp-dot--yellow" />
          <span className="lp-dot lp-dot--green" />
        </div>
        <span className="lp-mock-title">Lab Workspace — Docker Fundamentals</span>
        <span className="lp-mock-badge lp-badge--live">
          <span className="lp-badge-pulse" />
          Live
        </span>
      </div>

      {/* Status row */}
      <div className="lp-mock-status-row">
        <div className="lp-status-card lp-status-card--purple">
          <BarChart3 size={13} />
          <span>67% Complete</span>
        </div>
        <div className="lp-status-card lp-status-card--green">
          <Shield size={13} />
          <span>Environment Ready</span>
        </div>
        <div className="lp-status-card lp-status-card--yellow">
          <Zap size={13} />
          <span>Task 3 / 4</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="lp-mock-section">
        <div className="lp-mock-section-label">
          <TrendingUp size={12} />
          <span>Progress</span>
        </div>
        <div className="lp-progress-track">
          <div className="lp-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="lp-progress-meta">
          <span>3 of 4 tasks remaining</span>
          <span className="lp-progress-pct">{progress}%</span>
        </div>
      </div>

      {/* Task list */}
      <div className="lp-mock-section">
        <div className="lp-mock-section-label">
          <Target size={12} />
          <span>Tasks</span>
        </div>
        <div className="lp-task-list">
          {tasks.map((t, i) => (
            <div
              key={i}
              className={`lp-task-item${t.done ? ' lp-task-item--done' : ''}${t.active ? ' lp-task-item--active' : ''}`}
            >
              <div className={`lp-task-check${t.done ? ' lp-task-check--done' : ''}${t.active ? ' lp-task-check--active' : ''}`}>
                {t.done ? <CheckCircle2 size={12} /> : t.active ? <Play size={9} /> : <Circle size={10} />}
              </div>
              <span className="lp-task-label">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal preview */}
      <div className="lp-mock-section lp-mock-section--terminal">
        <div className="lp-mock-section-label">
          <SquareTerminal size={12} />
          <span>Terminal</span>
        </div>
        <div className="lp-terminal-body">
          <div className="lp-terminal-line">
            <span className="lp-term-prompt">$</span>
            <span className="lp-term-cmd"> docker compose up -d</span>
          </div>
          <div className="lp-terminal-line lp-term-output">
            <span className="lp-term-green">✓</span> Network created
          </div>
          <div className="lp-terminal-line lp-term-output">
            <span className="lp-term-green">✓</span> Container app_web started
          </div>
          <div className="lp-terminal-line lp-term-output">
            <span className="lp-term-green">✓</span> Container app_db started
          </div>
          <div className="lp-terminal-line lp-term-output lp-term-running">
            <span className="lp-term-yellow">⟳</span> Validating health check...
          </div>
          <div className="lp-terminal-line">
            <span className="lp-term-prompt">$</span>
            <span className="lp-term-cursor">█</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Feature Cards ─── */
const features = [
  {
    icon: FlaskConical,
    title: 'Interactive Labs',
    desc: 'Practice inside isolated environments with guided hands-on exercises designed for real-world scenarios.',
  },
  {
    icon: CheckCircle2,
    title: 'Real-Time Validation',
    desc: 'Receive instant feedback while solving challenges so you always know when your solution is correct.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    desc: 'Monitor completed tasks and continue learning from where you left off across all your challenges.',
  },
  {
    icon: Sparkles,
    title: 'Modern Learning Experience',
    desc: 'Clean interface designed to help you focus entirely on solving problems without distractions.',
  },
];

/* ─── How It Works ─── */
const steps = [
  {
    num: '01',
    icon: BookOpen,
    title: 'Choose a Challenge',
    desc: 'Browse available guided challenges across different difficulty levels and topics.',
  },
  {
    num: '02',
    icon: Play,
    title: 'Start Your Lab',
    desc: 'Launch your personal interactive workspace in seconds with everything pre-configured.',
  },
  {
    num: '03',
    icon: Trophy,
    title: 'Complete & Learn',
    desc: 'Finish tasks, validate your work and track your progress as you build practical skills.',
  },
];

/* ─── Why Cards ─── */
const whyCards = [
  {
    icon: Layers,
    title: 'Hands-on Learning',
    desc: 'Learn through practical exercises instead of only reading theory.',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    desc: 'Validate your progress immediately so learning never stalls.',
  },
  {
    icon: Terminal,
    title: 'Personal Workspace',
    desc: 'Each session runs in an isolated environment just for you.',
  },
  {
    icon: BarChart3,
    title: 'Track Your Progress',
    desc: 'Resume challenges and monitor every completed task easily.',
  },
];

/* ─── Main Landing Page ─── */
const LandingPage = () => {
  const hero     = useInView(0.1);
  const features = useInView(0.1);
  const howWorks = useInView(0.1);
  const whySect  = useInView(0.1);
  const cta      = useInView(0.1);

  return (
    <div className="lp-root">
      {/* Ambient blobs */}
      <div className="lp-blob lp-blob--1" />
      <div className="lp-blob lp-blob--2" />
      <div className="lp-blob lp-blob--3" />

      {/* ── Nav ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-nav-brand">
            <div className="lp-nav-icon">
              <Zap size={18} />
            </div>
            <span className="lp-nav-name">ChallengeLabs</span>
          </div>
          <div className="lp-nav-actions">
            <Link to="/login" className="lp-nav-link">Sign In</Link>
            <Link to="/register" className="lp-btn-nav-cta">
              Get Started
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-container">
          <div
            ref={hero.ref}
            className={`lp-hero-grid${hero.inView ? ' lp-fade-in' : ''}`}
          >
            {/* Left */}
            <div className="lp-hero-left">
              <div className="lp-hero-pill">
                <Sparkles size={12} />
                <span>Interactive Developer Labs</span>
              </div>
              <h1 className="lp-hero-heading">
                Learn by Doing.{' '}
                <span className="lp-gradient-text">Build Skills Through Interactive Labs.</span>
              </h1>
              <p className="lp-hero-desc">
                ChallengeLabs is an interactive learning platform where you solve real hands-on
                challenges inside isolated lab environments. Practice, experiment and learn with
                instant feedback.
              </p>
              <div className="lp-hero-actions">
                <Link to="/register" className="lp-btn-primary" id="lp-hero-get-started">
                  Get Started
                  <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="lp-btn-ghost" id="lp-hero-sign-in">
                  Sign In
                </Link>
              </div>
              <div className="lp-hero-stats">
                <div className="lp-hero-stat">
                  <span className="lp-hero-stat-num">100+</span>
                  <span className="lp-hero-stat-lbl">Challenges</span>
                </div>
                <div className="lp-hero-stat-divider" />
                <div className="lp-hero-stat">
                  <span className="lp-hero-stat-num">Real</span>
                  <span className="lp-hero-stat-lbl">Environments</span>
                </div>
                <div className="lp-hero-stat-divider" />
                <div className="lp-hero-stat">
                  <span className="lp-hero-stat-num">Instant</span>
                  <span className="lp-hero-stat-lbl">Feedback</span>
                </div>
              </div>
            </div>

            {/* Right — Mock Lab UI */}
            <div className="lp-hero-right">
              <div className="lp-mock-wrapper">
                <MockLabInterface />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-section">
        <div className="lp-container">
          <div
            ref={features.ref}
            className={`lp-section-header${features.inView ? ' lp-fade-in' : ''}`}
          >
            <div className="lp-section-pill">
              <FlaskConical size={12} />
              <span>Platform Features</span>
            </div>
            <h2 className="lp-section-heading">Everything you need to <span className="lp-gradient-text">learn by building</span></h2>
            <p className="lp-section-sub">
              Designed for developers who prefer hands-on experience over passive reading.
            </p>
          </div>

          <div className={`lp-features-grid${features.inView ? ' lp-fade-in lp-stagger' : ''}`}>
            {[
              { icon: FlaskConical, title: 'Interactive Labs', desc: 'Practice inside isolated environments with guided hands-on exercises designed for real-world scenarios.' },
              { icon: CheckCircle2, title: 'Real-Time Validation', desc: 'Receive instant feedback while solving challenges so you always know when your solution is correct.' },
              { icon: TrendingUp, title: 'Progress Tracking', desc: 'Monitor completed tasks and continue learning from where you left off across all your challenges.' },
              { icon: Sparkles, title: 'Modern Learning Experience', desc: 'Clean interface designed to help you focus entirely on solving problems without distractions.' },
            ].map((f, i) => (
              <div key={i} className="lp-feature-card" style={{ '--delay': `${i * 80}ms` } as React.CSSProperties}>
                <div className="lp-feature-icon">
                  <f.icon size={20} />
                </div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
                <div className="lp-feature-arrow">
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="lp-section lp-section--alt">
        <div className="lp-container">
          <div
            ref={howWorks.ref}
            className={`lp-section-header${howWorks.inView ? ' lp-fade-in' : ''}`}
          >
            <div className="lp-section-pill">
              <Play size={12} />
              <span>How It Works</span>
            </div>
            <h2 className="lp-section-heading">
              From zero to <span className="lp-gradient-text">hands-on in minutes</span>
            </h2>
            <p className="lp-section-sub">Three simple steps to start learning by doing.</p>
          </div>

          <div className={`lp-steps-grid${howWorks.inView ? ' lp-fade-in lp-stagger' : ''}`}>
            {[
              { num: '01', icon: BookOpen, title: 'Choose a Challenge', desc: 'Browse available guided challenges across different difficulty levels and topics.' },
              { num: '02', icon: Play, title: 'Start Your Lab', desc: 'Launch your personal interactive workspace in seconds with everything pre-configured.' },
              { num: '03', icon: Trophy, title: 'Complete & Learn', desc: 'Finish tasks, validate your work and track your progress as you build practical skills.' },
            ].map((s, i) => (
              <div key={i} className="lp-step-card" style={{ '--delay': `${i * 100}ms` } as React.CSSProperties}>
                <div className="lp-step-num-badge">{s.num}</div>
                <div className="lp-step-icon">
                  <s.icon size={22} />
                </div>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-desc">{s.desc}</p>
                {i < 2 && <div className="lp-step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ChallengeLabs ── */}
      <section className="lp-section">
        <div className="lp-container">
          <div
            ref={whySect.ref}
            className={`lp-section-header${whySect.inView ? ' lp-fade-in' : ''}`}
          >
            <div className="lp-section-pill">
              <Target size={12} />
              <span>Why ChallengeLabs</span>
            </div>
            <h2 className="lp-section-heading">
              Built for <span className="lp-gradient-text">real learning</span>
            </h2>
            <p className="lp-section-sub">
              Not another tutorial platform. A real environment that teaches through doing.
            </p>
          </div>

          <div className={`lp-why-grid${whySect.inView ? ' lp-fade-in lp-stagger' : ''}`}>
            {[
              { icon: Layers, title: 'Hands-on Learning', desc: 'Learn through practical exercises instead of only reading theory.' },
              { icon: Zap, title: 'Instant Feedback', desc: 'Validate your progress immediately so learning never stalls.' },
              { icon: Terminal, title: 'Personal Workspace', desc: 'Each session runs in an isolated environment just for you.' },
              { icon: BarChart3, title: 'Track Your Progress', desc: 'Resume challenges and monitor every completed task easily.' },
            ].map((w, i) => (
              <div key={i} className="lp-why-card" style={{ '--delay': `${i * 80}ms` } as React.CSSProperties}>
                <div className="lp-why-icon">
                  <w.icon size={18} />
                </div>
                <h3 className="lp-why-title">{w.title}</h3>
                <p className="lp-why-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-section lp-section--cta">
        <div className="lp-container">
          <div
            ref={cta.ref}
            className={`lp-cta-card${cta.inView ? ' lp-fade-in' : ''}`}
          >
            <div className="lp-cta-glow" />
            <div className="lp-section-pill lp-pill--centered">
              <Sparkles size={12} />
              <span>Start Today</span>
            </div>
            <h2 className="lp-cta-heading">Ready to Start Learning?</h2>
            <p className="lp-cta-sub">
              Explore interactive challenges, improve your practical skills and learn one task at a time.
            </p>
            <div className="lp-cta-actions">
              <Link to="/register" className="lp-btn-primary lp-btn-lg" id="lp-cta-create-account">
                Create Account
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="lp-btn-ghost lp-btn-ghost--lg" id="lp-cta-sign-in">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-inner">
            <div className="lp-footer-brand">
              <div className="lp-nav-icon lp-nav-icon--sm">
                <Zap size={15} />
              </div>
              <span className="lp-footer-name">ChallengeLabs</span>
            </div>
            <p className="lp-footer-tagline">Learn • Practice • Improve</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
