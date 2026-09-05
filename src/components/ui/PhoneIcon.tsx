import { cn } from "@/lib/utils";

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-5", className)}
    >
      <path
        d="M6.6 3.5h2.2c.5 0 .9.3 1 .8l.8 3a1.1 1.1 0 0 1-.3 1.1l-1.4 1.3a12.6 12.6 0 0 0 5.4 5.4l1.3-1.4a1.1 1.1 0 0 1 1.1-.3l3 .8c.5.1.8.5.8 1v2.2a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
