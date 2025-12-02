"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ${className}`}
  >
    {children}
  </button>
);

export default Button;
