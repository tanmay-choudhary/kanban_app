import React, { useState, useEffect } from "react";

function Create({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const storedBoards = JSON.parse(window.localStorage.getItem("boards"));
    if (storedBoards) {
      setBoards(storedBoards);
    }
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAddBoard = () => {
    if (name && description) {
      const newBoard = {
        id: Date.now(),
        name,
        description,
        kanbans: [
          { name: "todo", items: [] },
          { name: "in_progress", items: [] },
          { name: "completed", items: [] },
        ],
      };
      const updatedBoards = [...boards, newBoard];
      setBoards(updatedBoards);
      window.localStorage.setItem("boards", JSON.stringify(updatedBoards));
      setName("");
      setDescription("");
      onClose(); // Close the modal after adding a board
    }
  };

  const handleDeleteBoard = (id) => {
    const updatedBoards = boards.filter((board) => board.id !== id);
    setBoards(updatedBoards);
    window.localStorage.setItem("boards", JSON.stringify(updatedBoards));
  };

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Create Board</h2>
            <label
              className="block text-sm font-medium text-gray-600 mb-1"
              htmlFor="name"
            >
              Name:
            </label>
            <input
              className="border border-gray-300 p-2 mb-4 w-full"
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
            />

            <label
              className="block text-sm font-medium text-gray-600 mb-1"
              htmlFor="description"
            >
              Description:
            </label>
            <input
              className="border border-gray-300 p-2 mb-4 w-full"
              type="text"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
            />

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleAddBoard}
            >
              Add Board
            </button>
            <button
              className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => onClose()} // Corrected the onClick handler
            >
              Cancel
            </button>
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Boards:</h2>
              <ul>
                {boards.map((board) => (
                  <li key={board.id} className="mb-2 flex items-center">
                    <span className="font-semibold mr-2">{board.name}:</span>{" "}
                    {board.description}
                    <button
                      className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDeleteBoard(board.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Create;
