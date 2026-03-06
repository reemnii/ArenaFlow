import React from "react";

const ButtonOutline = ({ children }) => {
  return (
    <button className="font-bold tracking-wide py-2 px-5 sm:px-8 border border-white text-white bg-transparent outline-none rounded-l-full rounded-r-full capitalize hover:bg-white hover:text-brand-deep transition-all hover:shadow-brand-deep ">
      {children}
    </button>
  );
};

export default ButtonOutline;