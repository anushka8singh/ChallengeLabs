interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;

  currentLabTitle?: string;

  description: string;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;

  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal = ({
  isOpen,
  title,
  currentLabTitle,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="confirmation-modal">

        <h2>{title}</h2>

        {currentLabTitle && (
          <>
            <p className="modal-section-title">
              Currently Running
            </p>

            <div className="current-lab-box">
              {currentLabTitle}
            </div>
          </>
        )}

        <p className="modal-description">
          {description}
        </p>

        <div className="modal-actions">

          <button
            className="btn-secondary"
            disabled={loading}
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="btn-primary"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading
              ? "Please wait..."
              : confirmText}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmationModal;