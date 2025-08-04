import type { SVGProps } from 'react';

export function DulceBocadoLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-1.024.19-1.412.518l-1.786.992a.75.75 0 000 1.298l4.933 2.74a.75.75 0 00.832 0l4.933-2.74a.75.75 0 000-1.298l-1.786-.992A2.25 2.25 0 0014.625 8.25h-5.25zM12 15.75l-4.933-2.74a.75.75 0 00-.416.649v1.5a.75.75 0 00.416.649l4.933 2.74a.75.75 0 00.832 0l4.933-2.74a.75.75 0 00.416-.649v-1.5a.75.75 0 00-.416-.649L12 15.75z"
        clipRule="evenodd"
      />
    </svg>
  );
}
