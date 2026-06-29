import { Loader2 } from "lucide-react";

interface LabActionOverlayProps {
  open: boolean;
  title: string;
  description: string;
}

const LabActionOverlay = ({
  open,
  title,
  description,
}: LabActionOverlayProps) => {
  if (!open) return null;

  return (
    <div className="lab-overlay">

      <div className="lab-overlay-card">

        <Loader2
          className="lab-overlay-spinner"
          size={42}
        />

        <h2>{title}</h2>

        <p>{description}</p>

      </div>

    </div>
  );
};

export default LabActionOverlay;