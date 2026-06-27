import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  createTask,
} from '../services/adminService';

const AdminCreateTaskPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    order: 1,
    hint: '',
    validationRule: '',
    expectedOutcome: '',
  });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!challengeId) return;

    try {
      setLoading(true);

      await createTask(
        challengeId,
        form
      );

      toast.success(
        'Task created successfully'
      );

     navigate(
  `/admin/challenges/${challengeId}/tasks`,
  {
    state: {
      refresh: true,
    },
  }
);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          'Failed to create task'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <button onClick={() => navigate(`/admin/challenges/${challengeId}/tasks`)} className="back-btn" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={14} /> Back to tasks
      </button>

      <div className="admin-form-container" style={{ maxWidth: '100%' }}>
        <h2 className="dashboard-welcome-title" style={{ fontSize: '20px', marginBottom: '24px' }}>
          Create Task
        </h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Verify Apache Service is Running"
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
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              style={{ minHeight: '100px', resize: 'vertical' }}
              placeholder="Describe what steps the student needs to complete..."
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
            <label className="form-label">Task Order (Sequence)</label>
            <input
              type="number"
              className="form-input"
              value={form.order}
              onChange={(e) =>
                setForm({
                  ...form,
                  order: Number(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hint (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Check systemctl status apache2"
              value={form.hint}
              onChange={(e) =>
                setForm({
                  ...form,
                  hint: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Validation Rule (Command or Script)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. systemctl is-active apache2"
              value={form.validationRule}
              onChange={(e) =>
                setForm({
                  ...form,
                  validationRule: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expected Outcome (Output pattern to match)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. active"
              value={form.expectedOutcome}
              onChange={(e) =>
                setForm({
                  ...form,
                  expectedOutcome: e.target.value,
                })
              }
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/admin/challenges/${challengeId}/tasks`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ minWidth: '140px' }}
            >
              {loading ? <span className="btn-spinner" /> : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateTaskPage;