import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
        `/admin/challenges/${challengeId}/tasks`
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
    <div>
      <h1>Create Task</h1>

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

        <br /><br />

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

        <br /><br />

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

        <br /><br />

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

        <br /><br />

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

        <br /><br />

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

        <br /><br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Creating...'
            : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateTaskPage;