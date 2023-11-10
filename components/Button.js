// components/Button.js

import React from "react";

const Button = ({ name, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
    >
      {name}
    </button>
  );
};

export default Button;
