type IconProps = {
  className?: string;
};

export function MailIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6.25A2.25 2.25 0 0 1 6.25 4h11.5A2.25 2.25 0 0 1 20 6.25v11.5A2.25 2.25 0 0 1 17.75 20H6.25A2.25 2.25 0 0 1 4 17.75V6.25Zm2.4.15 5.6 4.18 5.6-4.18H6.4Zm11.35 2.77-5.08 3.79a1.15 1.15 0 0 1-1.34 0L6.25 9.17v8.58h11.5V9.17Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7.5 10V8a4.5 4.5 0 1 1 9 0v2h.25A2.25 2.25 0 0 1 19 12.25v6.5A2.25 2.25 0 0 1 16.75 21h-9.5A2.25 2.25 0 0 1 5 18.75v-6.5A2.25 2.25 0 0 1 7.25 10h.25Zm1.5 0h6V8a3 3 0 0 0-6 0v2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 12.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm-7 7.75a7 7 0 0 1 14 0v.25H5v-.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="m7.1 4.3 1.2-1.2L14.2 9l-5.9 5.9-1.2-1.2L11.8 9 7.1 4.3Z" fill="currentColor" />
    </svg>
  );
}
