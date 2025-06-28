import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
  return (
    <button
      {...props}
      className="h-9 bg-blue-600 rounded-md text-white font-medium gap-2 flex items-center justify-center mb-7 cursor-pointer"
    >
      {props.children}
    </button>
  );
};
