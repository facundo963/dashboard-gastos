import type { ReactElement } from 'react';
import { cloneElement } from 'react';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactElement;
}

/** Envuelve un input y le conecta label, error y atributos de accesibilidad */
export function Field({ id, label, error, children }: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && (
        <span className="field__error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  );
}
