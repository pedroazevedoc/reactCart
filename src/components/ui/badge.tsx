import type { BadgeProps } from "./types";

export function Badge({ 
  text, 
  color = "default",
  size = "medium",
  rounded = true,
}: BadgeProps) {
  // Mapeamento de cores para cada tipo de badge
  const colorMap: Record<string, string> = {
    default: "bg-gray-500 text-white",
    primary: "bg-taupe-800 text-taupe-50",
    blue: "bg-gray-500 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-black",
    error: "bg-red-500 text-white",
    outline: "border border-taupe-800 text-taupe-800 bg-transparent",
  };

  // Define a cor da badge com base no tipo fornecido
  const badgeColor = colorMap[color];

  // Define o tamanho da badge com base no tamanho fornecido
  const sizeMap: Record<string, string> = {
    small: "px-2 py-1 text-xs",
    medium: "px-3 py-1.5 text-sm",
    large: "px-4 py-2 text-base",
  };

  const badgeSize = sizeMap[size];

  // Define o arredondamento da badge
  const borderRadius = rounded ? "rounded-full" : "rounded-md";

  return (
    <span className={`${badgeColor} ${badgeSize} ${borderRadius} font-medium`}>
      {text}
    </span>
  );
}