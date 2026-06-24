import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminChallenges,
  type AdminChallenge,
} from '../services/adminService';
import toast from 'react-hot-toast';
import { deleteChallenge } from '../services/adminService';


const AdminDashboardPage = () => {
    const navigate = useNavigate();
  const [challenges, setChallenges] =
    useState<AdminChallenge[]>([]);

  const [loading, setLoading] =
    useState(true);
const handleDelete = async (
  challengeId: string
) => {
  try {
    await deleteChallenge(challengeId);

    setChallenges((prev) =>
      prev.filter(
        (c) => c.id !== challengeId
      )
    );

    toast.success(
      'Challenge deleted'
    );
  } catch {
    toast.error(
      'Failed to delete challenge'
    );
  }
};
  useEffect(() => {
    getAdminChallenges()
      .then((res) => {
        if (res.success) {
          setChallenges(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>
        Total Challenges: {challenges.length}
      </p>

      <hr />
<button
  onClick={() => navigate('/admin/challenges/new')}
  style={{
    marginBottom: '20px',
    padding: '10px 16px',
    cursor: 'pointer',
  }}
>
  + Create Challenge
</button>
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          style={{
            border: '1px solid #333',
            padding: '12px',
            marginBottom: '12px',
          }}
        >
          <h3>{challenge.title}</h3>

          <p>
            Difficulty: {challenge.difficulty}
          </p>

          <p>
            Tasks: {challenge.tasks.length}
          </p>

          <p>
            Published:{' '}
            {challenge.isPublished
              ? 'Yes'
              : 'No'}
          </p>
          <button
  onClick={() =>
    navigate(
      `/admin/challenges/${challenge.id}/tasks`
    )
  }
  style={{
    marginTop: '10px',
    padding: '8px 12px',
    cursor: 'pointer',
  }}
>
  Manage Tasks
</button>

<button
  onClick={() =>
    navigate(
      `/admin/challenges/${challenge.id}/edit`
    )
  }
  style={{
    marginLeft: '10px',
  }}
>
  Edit
</button>

<button
  onClick={() =>
    handleDelete(challenge.id)
  }
  style={{
    marginLeft: '10px',
  }}
>
  Delete
</button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboardPage;