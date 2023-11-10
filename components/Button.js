// components/Button.js

import React from "react";
import { useRouter } from "next/router";

const Button = ({ name, url }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(url);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
    >
      {name}
    </button>
  );
};

export default Button;
