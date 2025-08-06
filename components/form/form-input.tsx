"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { ClearButton } from "./clear-button";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  className?: string;
  disabled?: boolean;
}

const FormInput = ({
  name,
  label,
  required,
  placeholder,
  type,
  className,
  disabled,
}: Props) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();
  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClear = () => {
    setValue(name, "", { shouldValidate: true });
  };

  return (
    <div>
      {label && (
        <Label className={cn("text-[14px] font-bold mb-1", className)}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="relative">
        <Input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            `text-[16px] px-4 py-3 border-gray-100 ${
              errorText && "border-red-400"
            }`,
            className
          )}
        />
        {value && !disabled && <ClearButton onClick={onClear} />}
      </div>

      {errorText && (
        <p className="absolute text-sm text-red-500">{errorText}</p>
      )}
    </div>
  );
};

export default FormInput;
