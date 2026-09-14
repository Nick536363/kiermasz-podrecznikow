/**
 * module name:
 *  + Button.tsx
 *
 * description:
 *  + Defines Button component.
 */

import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
	primary: "bg-[#1F2A24] text-[#F6F4EF] hover:bg-[#2A382F]",
	ghost: "text-[#5C5A4E] hover:bg-[#EDEAE0]",
	danger: "text-[#A13D3D] hover:underline",
};

export function Button({
	variant = "primary",
	className = "",
	...props
}: ButtonProps) {
	return (
		<button
			{...props}
			className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${VARIANT_CLASS[variant]} ${className}`}
		/>
	);
}
