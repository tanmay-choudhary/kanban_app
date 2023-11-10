import React, { useState, useEffect } from "react";

function Create() {
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
        kanbans: {
          todo: [],
          in_progress: [],
          completed: [],
        },
      };
      const updatedBoards = [...boards, newBoard];
      setBoards(updatedBoards);
      window.localStorage.setItem("boards", JSON.stringify(updatedBoards));
      setName("");
      setDescription("");
    }
  };
  const handleDeleteBoard = (id) => {
    const updatedBoards = boards.filter((board) => board.id !== id);
    setBoards(updatedBoards);
    window.localStorage.setItem("boards", JSON.stringify(updatedBoards));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label
          className="block text-sm font-medium text-gray-600 mb-1"
          htmlFor="name"
        >
          Name:
        </label>
        <input
          className="border border-gray-300 p-2 w-full"
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-sm font-medium text-gray-600 mb-1"
          htmlFor="description"
        >
          Description:
        </label>
        <input
          className="border border-gray-300 p-2 w-full"
          type="text"
          id="description"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleAddBoard}
      >
        Add Board
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
  );
}

export default Create;
