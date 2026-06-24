import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      estimatedMinutes: 30,
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
    <div>
      <h1>Create Challenge</h1>

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

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
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
              description: e.target.value,
            })
          }
        />

        <br />
        <br />

        <select
          value={form.difficulty}
          onChange={(e) =>
            setForm({
              ...form,
              difficulty:
                e.target.value as CreateChallengePayload['difficulty'],
            })
          }
        >
          <option value="BEGINNER">
            Beginner
          </option>

          <option value="INTERMEDIATE">
            Intermediate
          </option>

          <option value="ADVANCED">
            Advanced
          </option>
        </select>

        <br />
        <br />

        <input
          placeholder="Docker Image"
          value={form.dockerImage}
          onChange={(e) =>
            setForm({
              ...form,
              dockerImage: e.target.value,
            })
          }
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Estimated Minutes"
          value={form.estimatedMinutes}
          onChange={(e) =>
            setForm({
              ...form,
              estimatedMinutes:
                Number(e.target.value),
            })
          }
        />

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) =>
              setForm({
                ...form,
                isPublished:
                  e.target.checked,
              })
            }
          />
          Published
        </label>

        <br />
        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Creating...'
            : 'Create Challenge'}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateChallengePage;