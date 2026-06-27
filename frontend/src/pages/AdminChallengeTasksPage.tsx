import { useEffect, useState } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import {
  getChallengeTasks,
  type AdminTask,
} from '../services/adminService';
import toast from 'react-hot-toast';
import { deleteTask } from '../services/adminService';


const AdminChallengeTasksPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [tasks, setTasks] =
    useState<AdminTask[]>([]);

  const [loading, setLoading] =
    useState(true);
const loadTasks = async () => {
  if (!challengeId) return;

  try {
    setLoading(true);

    const res = await getChallengeTasks(challengeId);

    if (res.success) {
      setTasks(res.data);
    }
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
  loadTasks();
}, [
  challengeId,
  location.state,
]);

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
    return (
      <div className="error-state">
        <div className="btn-spinner" style={{ width: '24px', height: '24px' }} />
        <p style={{ marginTop: '12px' }}>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate('/admin')} className="back-btn">
          <ArrowLeft size={14} /> Back to dashboard
        </button>

        <button
          onClick={() => navigate(`/admin/challenges/${challengeId}/tasks/new`)}
          className="btn-primary"
        >
          <Plus size={16} /> Create Task
        </button>
      </div>

      <div className="dashboard-welcome" style={{ marginBottom: '24px' }}>
        <h2 className="dashboard-welcome-title">Manage Tasks</h2>
        <p className="dashboard-welcome-sub">
          Configure tasks for this challenge. Total tasks: <span className="text-accent" style={{ fontWeight: 600 }}>{tasks.length}</span>
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">No tasks configured</p>
          <p className="empty-state-sub">Create your first task to get started.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div className="task-number" style={{ marginTop: '2px' }}>
                    {task.order}
                  </div>
                  <div className="task-body">
                    <h3 className="task-title" style={{ fontSize: '15px' }}>{task.title}</h3>
                    <p className="task-description">{task.description}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => navigate(`/admin/tasks/${task.id}/edit`)}
                    className="btn-secondary btn-secondary-sm"
                    title="Edit Task"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn-danger btn-danger-sm"
                    title="Delete Task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {task.hint && (
                <div className="task-hint-wrapper">
                  <div className="task-hint-text">
                    <span style={{ fontWeight: 600, color: 'var(--warning)', display: 'block', marginBottom: '4px' }}>
                      Hint:
                    </span>
                    {task.hint}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminChallengeTasksPage;