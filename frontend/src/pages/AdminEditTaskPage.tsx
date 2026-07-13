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

   const [validationType, setValidationType] =
  useState('NONE');

const [directoryPath, setDirectoryPath] =
  useState('');

const [filePath, setFilePath] =
  useState('');

const [fileContent, setFileContent] =
  useState('');

const [permission, setPermission] =
  useState('');

const [command, setCommand] = useState('');
const [expectedOutput, setExpectedOutput] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    order: 1,
    hint: '',
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
          });

          const validation =
  task.validations?.[0];

if (!validation) {
  setValidationType("NONE");
} else {

  setValidationType(validation.type);

  const config = validation.config ?? {};

  switch (validation.type) {

    case "DIRECTORY_EXISTS":
      setDirectoryPath(
        config.directories?.[0] ?? ""
      );
      break;

    case "FILE_EXISTS":
      setFilePath(
        config.files?.[0] ?? ""
      );
      break;

    case "FILE_CONTAINS":
      setFilePath(config.file ?? "");
      setFileContent(
        config.contains ?? ""
      );
      break;

    case "PERMISSION":
      setFilePath(config.file ?? "");
      setPermission(
        config.permission ?? ""
      );
      break;

    case "COMMAND":
      setCommand(config.command ?? "");
      setExpectedOutput(
        config.expectedOutput ?? ""
      );
      break;
  }
}
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

      
  let payload: any = {
  title: form.title,
  description: form.description,
  order: form.order,
  hint: form.hint,
};

if (validationType !== "NONE") {

  let validationConfig: Record<
    string,
    unknown
  >;

  switch (validationType) {

    case "DIRECTORY_EXISTS":
      validationConfig = {
        directories: [directoryPath],
      };
      break;

    case "FILE_EXISTS":
      validationConfig = {
        files: [filePath],
      };
      break;

    case "FILE_CONTAINS":
      validationConfig = {
        file: filePath,
        contains: fileContent,
      };
      break;

    case "PERMISSION":
      validationConfig = {
        file: filePath,
        permission,
      };
      break;

    case "COMMAND":
    default:
      validationConfig = {
        command,
        expectedOutput:
          expectedOutput || undefined,
      };
  }

  payload.validationType =
    validationType;

  payload.validationConfig =
    validationConfig;
}

await updateTask(
  taskId,
  payload
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
  <label className="form-label">
    Validation Type
  </label>

 <select
  className="form-input"
  value={validationType}
  onChange={(e) =>
    setValidationType(e.target.value)
  }
>
  <option value="NONE">
    No Validation
  </option>

  <option value="COMMAND">
    Command
  </option>

  <option value="DIRECTORY_EXISTS">
    Directory Exists
  </option>

  <option value="FILE_EXISTS">
    File Exists
  </option>

  <option value="FILE_CONTAINS">
    File Contains
  </option>

  <option value="PERMISSION">
    Permission
  </option>
</select>
</div>

          {validationType === "COMMAND" && (
  <>
    <div className="form-group">
      <label className="form-label">
        Validation Rule
      </label>

      <input
        type="text"
        className="form-input"
        placeholder="e.g. systemctl is-active apache2"
       value={command}
onChange={(e) => setCommand(e.target.value)}
      />
    </div>

    <div className="form-group">
      <label className="form-label">
        Expected Outcome (Optional)
      </label>

      <input
        type="text"
        className="form-input"
        placeholder="Leave empty for exit-code validation"
       value={expectedOutput}
onChange={(e) => setExpectedOutput(e.target.value)}
      />
    </div>
  </>
)}

{validationType === "DIRECTORY_EXISTS" && (
  <div className="form-group">
    <label className="form-label">
      Directory Path
    </label>

    <input
      type="text"
      className="form-input"
      placeholder="e.g. docs"
      value={directoryPath}
      onChange={(e) =>
        setDirectoryPath(e.target.value)
      }
    />
  </div>
)}

{validationType === "FILE_EXISTS" && (
  <div className="form-group">
    <label className="form-label">
      File Path
    </label>

    <input
      type="text"
      className="form-input"
      placeholder="e.g. docs/readme.txt"
      value={filePath}
      onChange={(e) =>
        setFilePath(e.target.value)
      }
    />
  </div>
)}

{validationType === "FILE_CONTAINS" && (
  <>
    <div className="form-group">
      <label className="form-label">
        File Path
      </label>

      <input
        type="text"
        className="form-input"
        placeholder="e.g. docs/readme.txt"
        value={filePath}
        onChange={(e) =>
          setFilePath(e.target.value)
        }
      />
    </div>

    <div className="form-group">
      <label className="form-label">
        Expected Text
      </label>

      <input
        type="text"
        className="form-input"
        placeholder="e.g. Hello ChallengeLabs"
        value={fileContent}
        onChange={(e) =>
          setFileContent(e.target.value)
        }
      />
    </div>
  </>
)}

{validationType === "PERMISSION" && (
  <>
    <div className="form-group">
      <label className="form-label">
        File Path
      </label>

      <input
        type="text"
        className="form-input"
        placeholder="e.g. script.sh"
        value={filePath}
        onChange={(e) =>
          setFilePath(e.target.value)
        }
      />
    </div>

    <div className="form-group">
      <label className="form-label">
        Permission
      </label>

      <input
        type="text"
        className="form-input"
        placeholder="e.g. 755"
        value={permission}
        onChange={(e) =>
          setPermission(e.target.value)
        }
      />
    </div>
  </>
)}

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
