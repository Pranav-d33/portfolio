import React from "react";

type TextVariant = "body" | "body-sm" | "subheading" | "heading" | "heading-lg" | "display-sm" | "display";
type TextColor = "ebony" | "graphite" | "ash" | "stone" | "slate";
type TextFont = "degular" | "blanco";

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  font?: TextFont;
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4";
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<TextVariant, string> = {
  "body": "text-body leading-body text-graphite",
  "body-sm": "text-body-sm leading-body-sm text-graphite",
  "subheading": "text-subheading leading-subheading text-ebony font-medium",
  "heading": "text-heading leading-heading text-ebony font-medium",
  "heading-lg": "text-heading-lg leading-heading-lg text-ebony font-medium",
  "display-sm": "text-display-sm leading-display-sm text-ebony font-medium",
  "display": "text-display leading-display text-ebony font-medium",
};

const colorStyles: Record<TextColor, string> = {
  ebony: "text-ebony-text",
  graphite: "text-graphite-text",
  ash: "text-ash-text",
  stone: "text-stone-text",
  slate: "text-slate-text",
};

const fontStyles: Record<TextFont, string> = {
  degular: "font-degular",
  blanco: "font-blanco",
};

const defaultTags: Record<TextVariant, React.ElementType> = {
  "body": "p",
  "body-sm": "p",
  "subheading": "h3",
  "heading": "h2",
  "heading-lg": "h2",
  "display-sm": "h1",
  "display": "h1",
};

export function Text({ variant = "body", color, font, as, children, className = "" }: TextProps) {
  const Component = as || defaultTags[variant];
  return (
    <Component className={`${variantStyles[variant]} ${color ? colorStyles[color] : ""} ${font ? fontStyles[font] : ""} ${className}`}>
      {children}
    </Component>
  );
}
