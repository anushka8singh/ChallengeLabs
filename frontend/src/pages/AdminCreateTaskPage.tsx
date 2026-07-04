import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  createTask,
} from '../services/adminService';

const AdminCreateTaskPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);
const [validationType, setValidationType] = useState("COMMAND");

const [directoryPath, setDirectoryPath] = useState("");
const [filePath, setFilePath] = useState("");
const [fileContent, setFileContent] = useState("");
const [permission, setPermission] = useState("");

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

     const payload = {
  ...form,
};

switch (validationType) {

  case "DIRECTORY_EXISTS":

    payload.validationRule =
      `test -d "${directoryPath}"`;

    payload.expectedOutcome = "";

    break;

  case "FILE_EXISTS":

    payload.validationRule =
      `test -f "${filePath}"`;

    payload.expectedOutcome = "";

    break;

  case "FILE_CONTAINS":

    payload.validationRule =
      `grep -q '${fileContent}' "${filePath}"`;

    payload.expectedOutcome = "";

    break;

  case "PERMISSION":

    payload.validationRule =
      `[ "$(stat -c '%a' "${filePath}")" = "${permission}" ]`;

    payload.expectedOutcome = "";

    break;

}

await createTask(
  challengeId,
  payload
);

      toast.success(
        'Task created successfully'
      );

     navigate(
  `/admin/challenges/${challengeId}/tasks`,
  {
    state: {
      refresh: true,
    },
  }
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
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <button onClick={() => navigate(`/admin/challenges/${challengeId}/tasks`)} className="back-btn" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={14} /> Back to tasks
      </button>

      <div className="admin-form-container" style={{ maxWidth: '100%' }}>
        <h2 className="dashboard-welcome-title" style={{ fontSize: '20px', marginBottom: '24px' }}>
          Create Task
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
      <label className="form-label">
        Expected Outcome (Optional)
      </label>

      <input
        type="text"
        className="form-input"
        placeholder="Leave empty for exit-code validation"
        value={form.expectedOutcome}
        onChange={(e) =>
          setForm({
            ...form,
            expectedOutcome: e.target.value,
          })
        }
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
              onClick={() => navigate(`/admin/challenges/${challengeId}/tasks`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ minWidth: '140px' }}
            >
              {loading ? <span className="btn-spinner" /> : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateTaskPage;