import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Zap, Eye, EyeOff, Terminal, Shield, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import AnimatedBackground from '../components/common/AnimatedBackground';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res.success) {
        login(res.data.token, res.data.user);
        toast.success(res.message ?? 'Login successful');
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Login failed. Please try again.';
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
          Level up your<br />
          <span>DevOps skills</span><br />
          in real labs.
        </h1>

        <p className="auth-brand-sub">
          Hands-on challenges with live terminals, automated validation, and instant feedback.
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

          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email</label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" className="form-label">Password</label>
              <div className="form-input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input form-input--icon-right"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
              id="login-submit"
              type="submit"
              className="btn-primary btn-full"
              disabled={loading}
            >
              {loading ? <span className="btn-spinner" /> : 'Sign in'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
