"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  value?: string; // если хочешь управлять значением снаружи
  onValueChange?: (v: string) => void; // вызывается на каждый ввод
  onDebouncedChange?: (v: string) => void; // вызывается с задержкой (debounce)
  debounceMs?: number; // задержка, по умолчанию 250мс
  onSubmit?: (v: string) => void; // Enter
  onClear?: () => void; // очистка по кресту / Esc
  placeholder?: string;
  autoFocus?: boolean;
  className?: string; // доп. классы для контейнера
};

const SearchInput = ({
  value,
  onValueChange,
  onDebouncedChange,
  debounceMs = 250,
  onSubmit,
  onClear,
  placeholder = "Поиск…",
  autoFocus = false,
  className,
}: SearchInputProps) => {
  const [inner, setInner] = useState(value ?? "");
  const prevValueRef = useRef(value);

  // Синхронизация, если value контролируется снаружи
  useEffect(() => {
    if (value !== undefined && value !== prevValueRef.current) {
      prevValueRef.current = value;
      setInner(value);
    }
  }, [value]);

  // Дебаунс-колбэк
  useEffect(() => {
    if (!onDebouncedChange) return;
    const t = setTimeout(() => onDebouncedChange(inner), debounceMs);
    return () => clearTimeout(t);
  }, [inner, onDebouncedChange, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInner(v);
    onValueChange?.(v);
  };

  const doClear = () => {
    setInner("");
    onValueChange?.("");
    onDebouncedChange?.("");
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit?.(inner);
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (inner) doClear();
      else (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div role="search" className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <input
        value={inner}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Поиск"
        className={cn(
          // твои базовые стили из примера
          "bg-gray-200 dark:bg-neutral-800 dark:text-white w-full rounded-md h-7",
          // отступы под иконки
          "pl-8 pr-7",
          // фокус и доступность
          "outline-none   ",
          // плавность
          "transition-colors"
        )}
      />
    </div>
  );
};

export default SearchInput;
