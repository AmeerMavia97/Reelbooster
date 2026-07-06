"use client";
import Image from "next/image";
import React from "react";

interface IconInputProps {
  iconSrc: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  type?: string;
}

const SignupField: React.FC<IconInputProps> = ({
  iconSrc,
  placeholder,
  value,
  onChange,
  name,
  type = "text",
}) => {
  return (
    <div className="relative">
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full flex items-center justify-center background-opacityGradient">
        <Image src={iconSrc} alt="icon" height={20} width={20} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-border-color rounded-lg text-dark w-full py-4.5 pl-16 text-xs placeholder:text-gray bg-primary focus:outline-none focus:ring-1 focus:ring-main-green"
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
    </div>
  );
};

export default SignupField;
