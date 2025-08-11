import React from "react";

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {'sm'|'md'|'lg'} [props.padding='md']
 */
const Card = ({ children, className = "", padding = "md" }) => {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const pad = paddingClasses[padding] || paddingClasses.md;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${pad} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
