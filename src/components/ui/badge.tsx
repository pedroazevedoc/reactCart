import type { BadgeProps } from "./types";

export function Badge({ text }: BadgeProps) {
  return (
    <span className="bg-taupe-800 text-taupe-50 px-2 py-1 rounded-full text-xs font-medium">
      {text}
    </span>
  );
}