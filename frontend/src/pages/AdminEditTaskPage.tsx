import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
      <div>Loading task...</div>
    );
  }

  return (
    <div>
      <h1>Edit Task</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <br />
        <br />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
        />

        <br />
        <br />

        <input
          type="number"
          value={form.order}
          onChange={(e) =>
            setForm({
              ...form,
              order: Number(
                e.target.value
              ),
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Hint"
          value={form.hint}
          onChange={(e) =>
            setForm({
              ...form,
              hint: e.target.value,
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Validation Rule"
          value={form.validationRule}
          onChange={(e) =>
            setForm({
              ...form,
              validationRule:
                e.target.value,
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Expected Outcome"
          value={form.expectedOutcome}
          onChange={(e) =>
            setForm({
              ...form,
              expectedOutcome:
                e.target.value,
            })
          }
        />

        <br />
        <br />

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? 'Saving...'
            : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminEditTaskPage;