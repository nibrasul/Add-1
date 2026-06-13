import React from "react";

type LogoProps = React.SVGProps<SVGSVGElement>;

export default function Logo(props: LogoProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-current"
      {...props}
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
      <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
      <path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" />
    </svg>
  );
}
