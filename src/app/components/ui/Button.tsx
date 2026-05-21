import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "email" | "ghost";
  children: React.ReactNode;
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  const base = "btn";
  const variants = {
    primary: "btn-primary",
    email: "btn-email",
    ghost: "btn-ghost",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "primary", children, href, className = "", target, rel, download }: ButtonProps & { href: string; target?: string; rel?: string; download?: string }) {
  const base = "btn inline-flex";
  const variants = {
    primary: "btn-primary",
    email: "btn-email",
    ghost: "btn-ghost",
  };
  return (
    <a href={href} target={target} rel={rel} download={download} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </a>
  );
}
