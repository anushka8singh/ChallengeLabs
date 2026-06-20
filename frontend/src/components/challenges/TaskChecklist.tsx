import { useState } from 'react';
import { ChevronDown, ChevronRight, Lightbulb } from 'lucide-react';
import { Task } from '../../services/challengeService';

interface TaskChecklistProps {
  tasks: Task[];
}

const TaskChecklist = ({ tasks }: TaskChecklistProps) => {
  const [openHint, setOpenHint] = useState<string | null>(null);

  const toggleHint = (id: string) => {
    setOpenHint((prev) => (prev === id ? null : id));
  };

  const sorted = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div className="task-list">
      {sorted.map((task, idx) => (
        <div key={task.id} className="task-item">
          <div className="task-header">
            <div className="task-number">{idx + 1}</div>
            <div className="task-body">
              <p className="task-title">{task.title}</p>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
            </div>
          </div>

          {task.hint && (
            <div className="task-hint-wrapper">
              <button
                className="task-hint-toggle"
                onClick={() => toggleHint(task.id)}
              >
                <Lightbulb size={13} className="text-yellow-400" />
                <span>Hint</span>
                {openHint === task.id ? (
                  <ChevronDown size={13} />
                ) : (
                  <ChevronRight size={13} />
                )}
              </button>
              {openHint === task.id && (
                <p className="task-hint-text">{task.hint}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskChecklist;
