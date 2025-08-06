import React, { JSX } from "react";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

const sizeMap: Record<number, string> = {
  1: "text-3xl font-bold",
  2: "text-2xl font-semibold",
  3: "text-xl font-semibold",
  4: "text-lg font-medium",
  5: "text-base font-medium",
  6: "text-sm font-medium",
};

const Heading: React.FC<HeadingProps> = ({
  level = 1,
  children,
  className,
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeClass = sizeMap[level] || sizeMap[1];
  return <Tag className={`${sizeClass} ${className ?? ""}`}>{children}</Tag>;
};

export default Heading;
