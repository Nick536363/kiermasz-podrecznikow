/**
 * module name:
 *  + Input.tsx
 *
 * description:
 *  + Defines Input component.
 */

import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className = "", ...props }, ref) => (
		<input
			ref={ref}
			{...props}
			className={`rounded-md border border-[#D8D4C6] bg-white px-3 py-2 text-sm text-[#1F2A24] outline-none focus:border-[#8C6A3F] focus:ring-1 focus:ring-[#8C6A3F] ${className}`}
		/>
	),
);

Input.displayName = "Input";
