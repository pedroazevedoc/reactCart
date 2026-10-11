export interface BadgeProps {
  text: string;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "small" | "medium" | "large";
  rounded?: boolean;
  className?: string;
}