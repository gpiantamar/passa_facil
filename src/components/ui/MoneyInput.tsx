import React from "react";
import { Input } from "./Input";

interface MoneyInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  required?: boolean;
  id?: string;
}

export function MoneyInput({ label, value, onChange, error, required, id }: MoneyInputProps) {
  const [displayValue, setDisplayValue] = React.useState(
    value > 0 ? value.toFixed(2).replace(".", ",") : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d,]/g, "");
    setDisplayValue(raw);
    const parsed = parseFloat(raw.replace(",", "."));
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else {
      onChange(0);
    }
  };

  return (
    <Input
      label={label}
      id={id}
      value={displayValue}
      onChange={handleChange}
      error={error}
      required={required}
      leftIcon={<span className="text-xs font-medium text-slate-500">R$</span>}
      placeholder="0,00"
      inputMode="decimal"
    />
  );
}
