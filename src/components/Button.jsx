import React from "react";

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {'primary'|'secondary'|'success'|'danger'|'outline'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {function} [props.onClick]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className]
 * @param {'button'|'submit'|'reset'} [props.type='button']
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  const baseClasses =
    "whitespace-nowrap cursor-pointer font-medium rounded-lg transition-colors duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const variantCls = variantClasses[variant] || variantClasses.primary;
  const sizeCls = sizeClasses[size] || sizeClasses.md;

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantCls} ${sizeCls} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
