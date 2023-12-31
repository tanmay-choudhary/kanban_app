import React, { useState, useEffect, MouseEvent } from "react";

interface DropdownProps {
  options: Option[];
  onSelect: (option: Option) => void;
  id: string;
  setBoardData: (board: Board) => void;
  boards: Board[];
}

interface Option {
  id: number;
  name: string;
  // Add other properties as needed
}

interface Board {
  _id: number;
  name: string;
  // Add other properties as needed
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, id, setBoardData, boards }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(options[0] || null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (options && options.length > 0) {
      setSelectedOption(options[0]);
    }
  }, [options]);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);

    const selectedBoard = boards.find((board) => board._id === option.id);
    if (selectedBoard) {
      setBoardData(selectedBoard);
    }
  };

  return (
    <div className="relative inline-block text-left z-50">
      <div>
        <span className="rounded-md shadow-sm">
          <button
            type="button"
            onClick={toggleDropdown}
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200"
            id={id}
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            {selectedOption ? selectedOption.name : "Select an option"}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 12a1 1 0 01-.7-.29l-4-4a1 1 0 011.41-1.42L10 9.59l3.29-3.3a1 1 0 011.41 1.42l-4 4a1 1 0 01-.7.29z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby={id}
          >
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
