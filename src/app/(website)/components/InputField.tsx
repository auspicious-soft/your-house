import { ChangeEvent, FC } from 'react';

interface InputFieldProps {
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean;
  label?: string; // Added label prop for better readability and accessibility
}

const InputField: FC<InputFieldProps> = ({ type, value, placeholder, onChange , required, label }) => {
  return (
    <div className='mb-[30px]'>
      <label htmlFor="" className='text-[#353E6C] mb-2.5 inline-block text-base leading-[normal]  '>{label}</label>
      <input
      className='text-[#929292] text-[12px] h-[50px] md:h-[50px] w-full focus-visible:outline-[#1657FF] focus-visible:outline focus-visible:outline-1  px-4 md:px-5 md:text-[14px] rounded-[50px] border-none bg-[#F4F5F7]'
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
    />
    </div>

  );
};

export default InputField;
