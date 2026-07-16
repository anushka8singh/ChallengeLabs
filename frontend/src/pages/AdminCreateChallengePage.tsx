import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  createChallenge,
  type CreateChallengePayload,
} from '../services/adminService';

const AdminCreateChallengePage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] =
  useState<CreateChallengePayload>({
    title: '',
    slug: '',
    description: '',
    difficulty: 'BEGINNER',
    dockerImage: '',
    setupScript: '',
    estimatedMinutes: 30,
    isPremium: false,
    isPublished: false,
  });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createChallenge(form);

      toast.success(
        'Challenge created successfully'
      );

      navigate('/admin');
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          'Failed to create challenge'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <button onClick={() => navigate('/admin')} className="back-btn" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={14} /> Back to dashboard
      </button>

      <div className="admin-form-container" style={{ maxWidth: '100%' }}>
        <h2 className="dashboard-welcome-title" style={{ fontSize: '20px', marginBottom: '24px' }}>
          Create Challenge
        </h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Linux File Permissions"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. linux-file-permissions"
              value={form.slug}
              onChange={(e) =>
                setForm({
                  ...form,
                  slug: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              style={{ minHeight: '120px', resize: 'vertical' }}
              placeholder="Describe what the student will learn in this challenge..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty</label>
            <select
              className="form-input"
              style={{ cursor: 'pointer' }}
              value={form.difficulty}
              onChange={(e) =>
                setForm({
                  ...form,
                  difficulty:
                    e.target.value as CreateChallengePayload['difficulty'],
                })
              }
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

<div className="form-group">
  <label className="form-label">
    Challenge Type
  </label>

  <select
    className="form-input"
    value={form.isPremium ? "PREMIUM" : "BASIC"}
    onChange={(e) =>
      setForm({
        ...form,
        isPremium:
          e.target.value === "PREMIUM",
      })
    }
  >
    <option value="BASIC">
      Basic
    </option>

    <option value="PREMIUM">
      Premium
    </option>
  </select>
</div>

          <div className="form-group">
            <label className="form-label">Docker Image</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. ubuntu:22.04"
              value={form.dockerImage}
              onChange={(e) =>
                setForm({
                  ...form,
                  dockerImage: e.target.value,
                })
              }
              required
            />
          </div>
                <div className="form-group">
  <label className="form-label">
    Setup Script (Optional)
  </label>

  <textarea
    className="form-input"
    style={{
      minHeight: "180px",
      resize: "vertical",
      fontFamily: "monospace",
    }}
    placeholder={`# Commands executed automatically when the challenge starts

touch hello.txt

mkdir docs

echo "Hello ChallengeLabs" > docs/readme.txt`}
    value={form.setupScript}
    onChange={(e) =>
      setForm({
        ...form,
        setupScript: e.target.value,
      })
    }
  />
</div>
          <div className="form-group">
            <label className="form-label">Estimated Minutes</label>
            <input
              type="number"
              className="form-input"
              placeholder="30"
              value={form.estimatedMinutes}
              onChange={(e) =>
                setForm({
                  ...form,
                  estimatedMinutes: Number(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                className="admin-checkbox"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isPublished: e.target.checked,
                  })
                }
              />
              <span>Published (visible to students)</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ minWidth: '140px' }}
            >
              {loading ? <span className="btn-spinner" /> : 'Create Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateChallengePage;