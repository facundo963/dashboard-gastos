import { useEffect } from 'react';
import { Button } from '../ui';

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}

/** Aviso temporal con acción opcional (por ejemplo, "Deshacer") */
export function Toast({ message, actionLabel, onAction, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  return (
    <div className="toast" role="status">
      <span>{message}</span>
      {actionLabel && onAction && (
        <Button size="sm" variant="primary" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
