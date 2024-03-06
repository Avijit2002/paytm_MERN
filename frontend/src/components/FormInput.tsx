import { ChangeEventHandler } from "react";

interface formInputType {
  type?: string;
  label: string;
  placeholder?: string;
  value: string | number;
  onchange: ChangeEventHandler<HTMLInputElement>;
  error?: string;
}

function FormInput({
  type,
  label,
  placeholder,
  value,
  onchange,
  error,
}: formInputType) {
  return (
    <div className="my-3">
      <label className="text-2xl font-medium" htmlFor="">
        {label}
      </label>
      <br />
      <input
        value={value}
        onChange={onchange}
        className="border-2 p-2 my-3 w-full text-gray-700 text-lg"
        type={type || "text"}
        placeholder={placeholder}
      />
      {error != "" && <p className="text-red-600">{error}</p>}
    </div>
  );
}

export default FormInput;
