import type { InputHTMLAttributes } from "react";

type ColorPickerProps = InputHTMLAttributes<HTMLInputElement>;

export const ColorPicker = (props: ColorPickerProps) => {
  return (
    <input
      type="color"
      className="appearence-none border-0 h-10 w-14 rounded px-[1px] bg-[#D9D9D9] color-swatch-sm"
      {...props}
    />
  );
};
