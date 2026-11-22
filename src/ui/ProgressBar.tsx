interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const ratio = max > 0 ? value / max : 0;
  const color = ratio >= 1 ? 'var(--danger)' : ratio >= 0.8 ? 'var(--warn)' : 'var(--ok)';
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(Math.min(ratio, 1) * 100)}
    >
      <div className="progress__bar" style={{ width: `${Math.min(ratio, 1) * 100}%`, background: color }} />
    </div>
  );
}
