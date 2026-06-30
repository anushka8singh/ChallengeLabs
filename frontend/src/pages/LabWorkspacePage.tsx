import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import XTermTerminal from '../components/lab/XTermTerminal';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Clock, CheckCircle2, Target, Layers, Terminal as TerminalIcon, Play, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getCurrentProgress,
  validateTask,
  stopSession,
  getSessionById,
} from '../services/sessionService';
import { terminalSocketService } from '../services/terminalSocketService';
import type { ProgressData } from '../services/sessionService';
import LabActionOverlay from "../components/common/LabActionOverlay";
import ConfirmationModal from '../components/common/ConfirmationModal';
// Shape of the router state passed from ChallengeDetailsPage after startSession
interface LabLocationState {
  expiresAt?: string;
  status?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatExpiry = (iso?: string): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const LabSpinner = () => (
  <div className="lab-loading">
    <div className="lab-spinner" />
    <p className="lab-loading-text">Loading workspace…</p>
  </div>
);

const LabError = ({ message, onBack }: { message: string; onBack: () => void }) => (
  <div className="lab-error-state">
    <AlertCircle size={42} className="text-error" />
    <h2 className="lab-error-title">Session Unavailable</h2>
    <p className="lab-error-message">{message}</p>
    <button className="btn-secondary" onClick={onBack}>
      Browse Challenges
    </button>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const LabWorkspacePage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [sessionInfo, setSessionInfo] = useState<{
  expiresAt?: string;
  status?: string;
}>({
  expiresAt: (location.state as LabLocationState)?.expiresAt,
  status: (location.state as LabLocationState)?.status,
});
const [timeRemaining, setTimeRemaining] = useState('');

  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Terminal state
  
  const [connecting, setConnecting] = useState<boolean>(true);
  const [terminalError, setTerminalError] = useState<string | null>(null);
  const terminalWriteRef = useRef<(data: string) => void>(() => {});
  const [stoppingLab, setStoppingLab] = useState(false);
  // Task validation state
  const [validating, setValidating] = useState<boolean>(false);
const [showHint, setShowHint] = useState(false);
  const hasExpiredRef = useRef(false);
const [showStopModal, setShowStopModal] = useState(false);
const [terminalExpanded, setTerminalExpanded] =
  useState(false);
 

const [isDragging, setIsDragging] =
  useState(false);
  // Auto-scroll terminal output
 const [leftPanelWidth, setLeftPanelWidth] =
  useState(() => {
    return Number(
      localStorage.getItem(
        "lab-panel-width"
      ) ?? 44
    );
  });

  // Fetch initial progress
  useEffect(() => {
    if (!sessionId) {
      setError('Invalid session URL.');
      setLoading(false);
      return;
    }
        getSessionById(sessionId)
  .then((res) => {
    if (res.success && res.data) {
      setSessionInfo({
        expiresAt: res.data.expiresAt,
        status: res.data.status,
      });
    }
  })
  .catch(() => {
    console.warn('Could not load session details');
  });
    getCurrentProgress()
      .then((res) => {
        if (res.success && res.data) {
          setProgress(res.data);
        } else {
          setError('No active session found.');
        }
      })
      .catch((err) => {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setError('No active session found. Please start a new lab session.');
        } else {
          setError('Failed to load session progress. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  useEffect(() => {
  if (!sessionInfo.expiresAt) return;

  const updateTimer = () => {
    const remaining =
      new Date(sessionInfo.expiresAt!).getTime() - Date.now();

      if (remaining <= 0) {
  if (!hasExpiredRef.current) {
    hasExpiredRef.current = true;

    setTimeRemaining('Expired');

    toast.error('Lab session expired');

    navigate('/challenges');
  }

  return;
}

    const minutes = Math.floor(
      remaining / (1000 * 60)
    );

    const seconds = Math.floor(
      (remaining % (1000 * 60)) / 1000
    );

    setTimeRemaining(
      `${minutes}m ${seconds}s remaining`
    );
  };

  updateTimer();

  const interval = setInterval(
    updateTimer,
    1000
  );

  return () => clearInterval(interval);
}, [sessionInfo.expiresAt]);

  useEffect(() => {
  setShowHint(false);
}, [progress?.currentTask?.id]);


  // Connect to terminal via Socket.IO
  useEffect(() => {
    if (!sessionId) return;
    setConnecting(true);
    setTerminalError(null);

    terminalSocketService.connect(
      (data) => {
        // Handle output event: append chunk to output history
        terminalWriteRef.current(data);
      },
      (err) => {
        // Handle error event
        setTerminalError(err);
        toast.error(err);
      },
      (reason) => {
        // Handle terminal closed event
        setTerminalError(`Terminal connection closed: ${reason}`);
      },
      () => {
        // Socket successfully connected & authenticated -> join terminal session
        setConnecting(false);
        terminalSocketService.joinSession(sessionId);
      }
    );

    return () => {
      // Disconnect cleanly on page unmount
      terminalSocketService.disconnect();
    };
  }, [sessionId]);

  const handleBack = () => navigate('/challenges');

  const handleStopSession = async () => {
   setShowStopModal(false);
  setStoppingLab(true);

  try {
    await stopSession();

    toast.success("Session stopped successfully");

    navigate("/dashboard");

  } catch (error) {

    toast.error("Failed to stop session");

  } finally {

    setStoppingLab(false);

  }
};

useEffect(() => {
  if (!isDragging) return;

  document.body.classList.add("dragging");

  const handleMove = (e: MouseEvent) => {
    e.preventDefault();

    const percent = (e.clientX / window.innerWidth) * 100;

    if (percent >= 25 && percent <= 70) {
      setLeftPanelWidth(percent);
    }
  };

  const stopDragging = () => {
    document.body.classList.remove("dragging");
    setIsDragging(false);
  };

  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", stopDragging);

  return () => {
    document.body.classList.remove("dragging");
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", stopDragging);
    document.body.classList.add("dragging");
    document.body.classList.remove("dragging");
  };
}, [isDragging]);


useEffect(() => {
  localStorage.setItem(
    "lab-panel-width",
    leftPanelWidth.toString()
  );
}, [leftPanelWidth]);
  // Command submit handler
  

  // Keyboard navigation for command history (Up/Down arrows)
  

  // Clear output helper
 
  // Task validation handler
  const handleValidateTask = async () => {
    if (!progress?.currentTask || !sessionId || validating) return;
    setValidating(true);
    try {
      const res = await validateTask(progress.currentTask.id, sessionId);
      if (res.success && res.data.passed) {
        toast.success(res.data.feedback || 'Task completed successfully!');
        // Refresh progress
        const updatedProgress = await getCurrentProgress();
        if (updatedProgress.success && updatedProgress.data) {
          setProgress(updatedProgress.data);
        }
      } else {
        toast.error(res.data.feedback || 'Validation failed. Please try again.');
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Task validation failed. Please check command output.';
      toast.error(errorMsg);
    } finally {
      setValidating(false);
    }
  };

  // ── Shared header (always rendered) ──────────────────────────────────────
  const header = (
    <div className="lab-header">
      <button className="back-btn lab-back-btn" onClick={handleBack}>
        <ArrowLeft size={15} />
        Back
      </button>

      <span className="lab-header-title">
        {loading ? 'Lab Workspace' : (progress?.challengeTitle ?? 'Lab Workspace')}
      </span>

      <div className={`lab-status-badge lab-status-badge--${(sessionInfo.status || 'RUNNING').toLowerCase()}`}>
        <span className="lab-status-dot" />
        {sessionInfo.status || 'RUNNING'}
      </div>
      <button
  className="btn-stop-session"
  onClick={() => setShowStopModal(true)}
  style={{
    marginLeft: '12px',
  }}
>
  Stop Session
</button>
    </div>
  );

  if (loading) {
    return (
      <div className="lab-page">
        {header}
        <div className="lab-body">
          <LabSpinner />
        </div>
      </div>
    );
  }

  if (error || !progress) {
    return (
      <div className="lab-page">
        {header}
        <div className="lab-body">
          <LabError message={error ?? 'No active session found.'} onBack={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="lab-page">
      {header}

     <div
  className={`lab-body ${
    terminalExpanded
      ? "lab-body--expanded"
      : ""
  }`}
  style={
    !terminalExpanded
      ? {
          gridTemplateColumns: `${leftPanelWidth}% 6px auto`,
        }
      : undefined
  }
>

  {!terminalExpanded && (

    <div className="lab-left-panel">
          {/* ── Info Cards ─────────────────────────────────────────────────── */}
          <div className="lab-info-grid">
            

            {/* Expiry */}
            <div className="lab-info-card">
              <span className="lab-info-card-label">
                <Clock size={12} />
                Expires in
              </span>
              <span className="lab-info-card-value"> {timeRemaining || formatExpiry(sessionInfo.expiresAt)}</span>
            </div>

            {/* Task Counter */}
            <div className="lab-info-card">
              <span className="lab-info-card-label">
                <Layers size={12} />
                Tasks
              </span>
              <span className="lab-info-card-value">
                <span className="lab-count-done">{progress.completedTasks}</span>
                <span className="lab-count-sep"> / </span>
                {progress.totalTasks}
              </span>
            </div>
          </div>

          {/* ── Progress ──────────────────────────────────────────────────── */}
          <div className="lab-progress-section">
            <div className="lab-section-header">
              <h2 className="lab-section-title">Progress</h2>
              <span className="lab-progress-pct">{progress.percentage}%</span>
            </div>

            <div className="lab-progress-bar-track" role="progressbar" aria-valuenow={progress.percentage} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="lab-progress-bar-fill"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>

            <p className="lab-progress-sub">
              {progress.completedTasks} of {progress.totalTasks} tasks completed
            </p>
          </div>

          {/* ── Current Task ──────────────────────────────────────────────── */}
          {progress.currentTask ? (
            <div className="lab-current-task-section">
              <h2 className="lab-section-title">
                <Target size={16} />
                Current Task
              </h2>

              <div className="lab-current-task-card">
                <span className="lab-task-order-label">
                  Task {progress.currentTask.order}
                </span>
                <p className="lab-task-name">{progress.currentTask.title}</p>
                <p className="lab-task-description">
  {progress.currentTask.description}
</p>

{progress.currentTask.hint && (
  <div className="lab-task-hint">
    {!showHint ? (
      <button
        type="button"
        className="lab-hint-toggle"
        onClick={() => setShowHint(true)}
      >
        💡Hint
      </button>
    ) : (
      <>
        <div style={{ marginBottom: '8px' }}>
          💡 {progress.currentTask.hint}
        </div>

        <button
          type="button"
          className="lab-hint-toggle"
          onClick={() => setShowHint(false)}
        >
          Hide 
        </button>
      </>
    )}
  </div>
)}
                <div className="lab-task-status-row">
                  <CheckCircle2 size={14} className="text-secondary" />
                  <span className="lab-task-status-text">In Progress</span>
                </div>

                {/* Validate Button */}
                <button
                  id="validate-task-btn"
                  className="btn-primary lab-validate-btn"
                  onClick={handleValidateTask}
                  disabled={validating}
                >
                  {validating ? (
                    <>
                      <span className="btn-spinner" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Play size={14} />
                      Validate Task
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
  <div className="lab-current-task-section">
    <h2 className="lab-section-title">
      <CheckCircle2 size={16} />
      Challenge Complete
    </h2>

    <div className="lab-current-task-card lab-current-task-card--done">
      <CheckCircle2
        size={48}
        style={{
          color: 'var(--success)',
          marginBottom: '12px',
        }}
      />

      <p className="lab-task-name">
        Challenge Completed!
      </p>

      <p className="lab-task-description">
        You have successfully completed all {progress.totalTasks} tasks.
      </p>

      <div style={{ marginTop: '16px' }}>
        <p>
          <strong>Progress:</strong> {progress.percentage}%
        </p>

        <p>
          <strong>Tasks Completed:</strong>{' '}
          {progress.completedTasks}/{progress.totalTasks}
        </p>
      </div>

      <button
        className="btn-primary lab-validate-btn"
        style={{ marginTop: '20px' }}
        onClick={() => navigate('/challenges')}
      >
        Back to Challenges
      </button>
    </div>
  </div>
)}
        </div>
  )}
        {/* Right Panel: Terminal */}
        

<div
  className="lab-divider"
  onMouseDown={() =>
    setIsDragging(true)
  }
/>

{/* Right Panel */}
        <div
  className={`lab-right-panel ${
    terminalExpanded
      ? "lab-right-panel--expanded"
      : ""
  }`}
>
          <div className="terminal-panel">
            <div className="terminal-header">
              <div className="terminal-title-group">
                <TerminalIcon size={16} />
                <span>Interactive Terminal</span>
              </div>
              <div className="terminal-actions">

  <button
    className="terminal-action-btn"
    onClick={() =>
      setTerminalExpanded(
        !terminalExpanded
      )
    }
  >
    {terminalExpanded
      ? "🗗 Restore"
      : "⛶ Expand"}
  </button>

  <button
    className="terminal-action-btn"
    onClick={() => {
      terminalWriteRef.current("\x1Bc");
    }}
  >
    <Trash2 size={14} />
    <span>Clear</span>
  </button>

</div>
            </div>

            <div className="terminal-body">
              {connecting ? (
                <div className="lab-loading" style={{ padding: '48px 0' }}>
                  <div className="lab-spinner" />
                  <p className="lab-loading-text">Connecting to terminal session…</p>
                </div>
              ) : terminalError ? (
                <div className="lab-error-state" style={{ padding: '32px 0' }}>
                  <AlertCircle size={32} className="text-error" />
                  <p className="lab-error-message" style={{ margin: '8px 0 0 0' }}>
                    {terminalError}
                  </p>
                </div>
              ) : (
                <XTermTerminal
  onData={(data) => {
    terminalSocketService.sendInput(data);
  }}
  onResize={(cols, rows) => {
    terminalSocketService.resize(cols, rows);
  }}
  writeCallback={(write) => {
    terminalWriteRef.current = write;
  }}
/>
              )}
            </div>
          </div>
        </div>

      </div>
      <LabActionOverlay
  open={stoppingLab}
  title="Stopping Lab Session"
  description="Please wait while we stop your lab environment. You will be redirected to the dashboard shortly."
/>

<ConfirmationModal
  isOpen={showStopModal}
  title="Stop Lab Session"
  description="Your lab container will be stopped and you will be returned to the dashboard."
  confirmText="Stop Lab"
  cancelText="Cancel"
  loading={stoppingLab}
  onCancel={() => setShowStopModal(false)}
  onConfirm={handleStopSession}
/>
    </div>
  );
};

export default LabWorkspacePage;
