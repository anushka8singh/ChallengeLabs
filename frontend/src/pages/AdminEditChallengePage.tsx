import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  getChallengeById,
  updateChallenge,
  type CreateChallengePayload,
} from '../services/adminService';

const AdminEditChallengePage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

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

  useEffect(() => {
    if (!challengeId) return;

    getChallengeById(challengeId)
  .then((res) => {
    console.log('EDIT RESPONSE:', res);

    if (res.success) {
      const challenge = res.data;

      setForm({
        title: challenge.title,
        slug: challenge.slug,
        description: challenge.description,
        difficulty: challenge.difficulty,
        dockerImage: challenge.dockerImage,
        estimatedMinutes: challenge.estimatedMinutes,
        isPublished: challenge.isPublished,
      });
    }
  })
      .finally(() =>
        setLoading(false)
      );
  }, [challengeId]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!challengeId) return;

    try {
      setSaving(true);

      await updateChallenge(
        challengeId,
        form
      );

      toast.success(
        'Challenge updated successfully'
      );

      navigate('/admin');
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          'Failed to update challenge'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        Loading challenge...
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Challenge</h1>

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

export default AdminEditChallengePage;