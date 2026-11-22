interface BadgeProps {
  color: string;
  children: string;
}

export function Badge({ color, children }: BadgeProps) {
  return (
    <span className="badge" style={{ background: `${color}1f`, color }}>
      <span className="badge__dot" style={{ background: color }} />
      {children}
    </span>
  );
}
