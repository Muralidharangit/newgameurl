import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "cancel" | "gold" | "icon";
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  icon,
  className = "",
  ...props
}) => {
  let variantClass = "btn-winbet";

  if (variant === "cancel") {
    variantClass = "btn-cancel-action";
  } else if (variant === "gold") {
    variantClass = "btn-gold-action";
  } else if (variant === "icon") {
    variantClass = "btn-icon-control";
  }

  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {icon && <i className={`${icon} ${children ? "me-1" : ""}`}></i>}
      {children}
    </button>
  );
};
