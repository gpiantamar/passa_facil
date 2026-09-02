import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  children,
  className = "",
  onClick,
  padding = "md",
  hover = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-slate-100 shadow-sm
        ${paddingClasses[padding]}
        ${hover ? "hover:shadow-md hover:border-slate-200 transition-all duration-200 cursor-pointer" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}
