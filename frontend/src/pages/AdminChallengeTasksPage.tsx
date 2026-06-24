import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  getChallengeTasks,
  type AdminTask,
} from '../services/adminService';
import toast from 'react-hot-toast';
import { deleteTask } from '../services/adminService';


const AdminChallengeTasksPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] =
    useState<AdminTask[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!challengeId) return;

    getChallengeTasks(challengeId)
      .then((res) => {
        if (res.success) {
          setTasks(res.data);
        }
      })
      .finally(() =>
        setLoading(false)
      );
  }, [challengeId]);

  const handleDeleteTask = async (
  taskId: string
) => {
  try {
    await deleteTask(taskId);

    setTasks((prev) =>
      prev.filter(
        (task) => task.id !== taskId
      )
    );

    toast.success(
      'Task deleted successfully'
    );
  } catch {
    toast.error(
      'Failed to delete task'
    );
  }
};

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <h1>Manage Tasks</h1>

      <p>
        Total Tasks: {tasks.length}
      </p>

      <hr />
        <button
  onClick={() =>
    navigate(
      `/admin/challenges/${challengeId}/tasks/new`
    )
  }
  style={{
    marginBottom: '20px',
    padding: '10px 16px',
    cursor: 'pointer',
  }}
>
  + Create Task
</button>
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            border: '1px solid #333',
            padding: '12px',
            marginBottom: '12px',
          }}
        >
          <h3>
            {task.order}. {task.title}
          </h3>

          <p>
            {task.description}
          </p>

          {task.hint && (
  <p>
    Hint:
    {' '}
    {task.hint}
  </p>
)}
<button
  onClick={() =>
    navigate(
      `/admin/tasks/${task.id}/edit`
    )
  }
  style={{
    marginRight: '10px',
    cursor: 'pointer',
  }}
>
  Edit Task
</button>
<button
  onClick={() =>
    handleDeleteTask(task.id)
  }
  style={{
    marginTop: '10px',
    cursor: 'pointer',
  }}
>
  Delete Task
</button>
        </div>
      ))}
    </div>
  );
};

export default AdminChallengeTasksPage;