import React from "react";
import { SearchIcon, AtSymbolIcon, BellIcon } from "@heroicons/react/outline";
import Image from "next/image";

function TopBar(props) {
  return (
    <div
      className="h-16  fixed bg-gradient-to-r from-purple-400
        to-blue-500 w-full flex items-center justify-center text-white font-bold text-2xl"
    >
      Kanban Application
    </div>
  );
}

export default TopBar;
