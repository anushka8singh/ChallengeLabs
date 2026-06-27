import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  getTaskById,
  updateTask,
} from '../services/adminService';

const AdminEditTaskPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    order: 1,
    hint: '',
    validationRule: '',
    expectedOutcome: '',
  });

  useEffect(() => {
    if (!taskId) return;

    getTaskById(taskId)
      .then((res) => {
        if (res.success) {
          const task = res.data;

          setForm({
            title: task.title,
            description:
              task.description,
            order: task.order,
            hint: task.hint ?? '',
            validationRule:
              task.validationRule ?? '',
            expectedOutcome:
              task.expectedOutcome ?? '',
          });
        }
      })
      .finally(() =>
        setLoading(false)
      );
  }, [taskId]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!taskId) return;

    try {
      setSaving(true);

      await updateTask(
        taskId,
        form
      );

      toast.success(
        'Task updated successfully'
      );

      navigate(-1);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          'Failed to update task'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="error-state">
        <div className="btn-spinner" style={{ width: '24px', height: '24px' }} />
        <p style={{ marginTop: '12px' }}>Loading task...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="back-btn" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={14} /> Back to tasks
      </button>

      <div className="admin-form-container" style={{ maxWidth: '100%' }}>
        <h2 className="dashboard-welcome-title" style={{ fontSize: '20px', marginBottom: '24px' }}>
          Edit Task
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
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
              style={{ minWidth: '140px' }}
            >
              {saving ? <span className="btn-spinner" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditTaskPage;