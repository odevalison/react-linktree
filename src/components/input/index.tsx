import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: React.RefObject<HTMLInputElement | null>;
}

export function Input(props: InputProps) {
  return (
    <input
      className="h-9 max-w-[600px] border-0 rounded-md outline-none px-2 mb-4 bg-white"
      {...props}
    />
  );
}
