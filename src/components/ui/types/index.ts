type BadgeColor = 
  "default" |
  "primary" | 
  "blue" | 
  "success" | 
  "warning" | 
  "error" | 
  "outline";

export interface BadgeProps {
  text: string;
  color?: BadgeColor;
  size?: "small" | "medium" | "large";
  rounded?: boolean;
}