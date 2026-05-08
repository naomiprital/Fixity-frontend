import type { ChangeEventHandler, ReactNode } from 'react';
import './TextField.css';

type TextFieldProps = {
  id: string;
  name?: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'email' | 'password';
  icon: ReactNode;
  autoComplete?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
};

export function TextField({
  id,
  name,
  label,
  placeholder,
  type = 'text',
  icon,
  autoComplete,
  value,
  onChange,
  disabled = false,
}: TextFieldProps) {
  return (
    <label className="text-field" htmlFor={id}>
      <span className="text-field__label">{label}</span>
      <span className="text-field__control">
        <span className="text-field__icon" aria-hidden="true">
          {icon}
        </span>
        <input
          id={id}
          name={name ?? id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </span>
    </label>
  );
}
