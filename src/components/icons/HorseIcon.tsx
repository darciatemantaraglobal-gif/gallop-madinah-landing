import { Horse } from "@phosphor-icons/react";

// lucide-react has no horse icon, so this wraps Phosphor's Horse in the "light"
// weight, which matches the thin (strokeWidth 1.5) lucide icons used site-wide.
// Accepts the same props the lucide icons get here (className, strokeWidth is ignored).
const HorseIcon = ({ className }: { className?: string; strokeWidth?: number }) => (
  <Horse weight="light" className={className} aria-hidden="true" />
);

export default HorseIcon;
