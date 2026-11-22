import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'default' | 'ghost' | 'danger';
type Size = 'md' | 'sm' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = 'default', size = 'md', className = '', type = 'button', ...rest }: ButtonProps) {
  const classes = ['btn', variant !== 'default' && `btn--${variant}`, size !== 'md' && `btn--${size}`, className]
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={classes} {...rest} />;
}
