import React from "react";

const ButtonOutline = ({ children }) => {
  return (
    <button className="font-medium tracking-wide py-2 px-5 sm:px-8 border border-white text-white bg-transparent outline-none rounded-l-full rounded-r-full capitalize cursor-pointer hover:text-[#F0ABFC] transition-all hover:shadow-[#F0ABFC] hover:border-[#F0ABFC] hover:duration-75">
      {children}
    </button>
  );
};

export default ButtonOutline;