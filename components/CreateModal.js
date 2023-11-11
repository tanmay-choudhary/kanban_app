import React, { useState, useEffect } from "react";

function Create({ isOpen, onClose, onBoardUpdate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [boards, setBoards] = useState([]);
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);

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

  const handleCloseModal = () => {
    onClose();
    setEditingBoardId(null);
    setBoardToDelete(null);
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
      handleCloseModal();
      onBoardUpdate(updatedBoards);
    }
  };

  const handleDeleteBoard = (id) => {
    const updatedBoards = boards.filter((board) => board.id !== id);
    setBoards(updatedBoards);
    window.localStorage.setItem("boards", JSON.stringify(updatedBoards));
    handleCloseModal();
    onBoardUpdate(updatedBoards);
  };

  const handleEdit = (id) => {
    const boardToEdit = boards.find((board) => board.id === id);
    if (boardToEdit) {
      setName(boardToEdit.name);
      setDescription(boardToEdit.description);
      setEditingBoardId(id);
    }
  };

  const handleSaveEdit = () => {
    const updatedBoards = boards.map((board) =>
      board.id === editingBoardId ? { ...board, name, description } : board
    );
    setBoards(updatedBoards);
    window.localStorage.setItem("boards", JSON.stringify(updatedBoards));
    setName("");
    setDescription("");
    setEditingBoardId(null);
    onBoardUpdate(updatedBoards);
  };

  const handleConfirmDelete = () => {
    if (boardToDelete) {
      handleDeleteBoard(boardToDelete);
      setConfirmDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setBoardToDelete(null);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
              onClick={handleCloseModal}
            >
              {/* Cross Icon SVG */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-2">
              {editingBoardId ? "Edit Board" : "Create Board"}
            </h2>
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

            {editingBoardId ? (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSaveEdit}
              >
                Save Edit
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleAddBoard}
              >
                Add Board
              </button>
            )}

            <button
              className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={handleCloseModal}
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
                      className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
                      onClick={() => handleEdit(board.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                      onClick={() => {
                        setBoardToDelete(board.id);
                        setConfirmDelete(true);
                      }}
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

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md">
            <p className="text-xl font-semibold mb-4">Confirm Delete?</p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
                onClick={handleConfirmDelete}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleCancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Create;
