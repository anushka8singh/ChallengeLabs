import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Zap, Eye, EyeOff, Terminal, Shield, BookOpen } from 'lucide-react';
import { registerUser } from '../services/authService';
import AnimatedBackground from '../components/common/AnimatedBackground';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({ name, email, password });
      if (res.success) {
        toast.success(res.message ?? 'Account created! Please sign in.');
        navigate('/login');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AnimatedBackground />

      {/* Left branding panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-logo">
          <div className="auth-brand-logo-icon">
            <Zap size={22} />
          </div>
          <span className="auth-brand-logo-name">ChallengeLabs</span>
        </div>

        <h1 className="auth-brand-headline">
          Start your journey<br />
          into <span>hands-on</span><br />
          cloud engineering.
        </h1>

        <p className="auth-brand-sub">
          Join thousands of engineers mastering Linux, Docker, Kubernetes, and more through live lab environments.
        </p>

        <div className="auth-brand-features">
          <div className="auth-brand-feature">
            <div className="auth-brand-feature-icon">
              <Terminal size={14} />
            </div>
            <span>Real browser-based terminal environments</span>
          </div>
          <div className="auth-brand-feature">
            <div className="auth-brand-feature-icon">
              <Shield size={14} />
            </div>
            <span>Automated task validation engine</span>
          </div>
          <div className="auth-brand-feature">
            <div className="auth-brand-feature-icon">
              <BookOpen size={14} />
            </div>
            <span>Beginner to Advanced challenge paths</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Zap size={20} className="text-purple-400" />
            </div>
            <span className="auth-logo-text">ChallengeLabs</span>
          </div>

          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">Start your learning journey today</p>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="register-name" className="form-label">Full name</label>
              <input
                id="register-name"
                type="text"
                className="form-input"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email" className="form-label">Email</label>
              <input
                id="register-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password" className="form-label">Password</label>
              <div className="form-input-wrapper">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input form-input--icon-right"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="form-input-icon-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn-primary btn-full"
              disabled={loading}
            >
              {loading ? <span className="btn-spinner" /> : 'Create account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
