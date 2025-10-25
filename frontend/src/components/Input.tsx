import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.memo(React.forwardRef<HTMLInputElement, Props>(function InputBase(props, ref) {
  const { className = '', ...rest } = props;
  return (
    <input
      ref={ref}
      {...rest}
      className={
        "h-[36px] w-full rounded-sm border border-[#D9D9D9] bg-white px-3 text-[13px] placeholder:text-[#9B9B9B] outline-none focus:ring-2 focus:ring-brand-500 " +
        className
      }
    />
  );
}));

export default Input;
