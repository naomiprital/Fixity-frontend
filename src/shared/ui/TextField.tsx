import type { ReactNode } from 'react';
import './TextField.css';

type TextFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'email' | 'password';
  icon: ReactNode;
  autoComplete?: string;
};

export function TextField({
  id,
  label,
  placeholder,
  type = 'text',
  icon,
  autoComplete,
}: TextFieldProps) {
  return (
    <label className="text-field" htmlFor={id}>
      <span className="text-field__label">{label}</span>
      <span className="text-field__control">
        <span className="text-field__icon" aria-hidden="true">
          {icon}
        </span>
        <input id={id} type={type} placeholder={placeholder} autoComplete={autoComplete} />
      </span>
    </label>
  );
}
