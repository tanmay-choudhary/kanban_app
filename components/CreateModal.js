import { UploadIcon } from "@heroicons/react/outline";
import React, { useState, useEffect } from "react";

// Extracted modal component
const Modal = ({ isOpen, onClose, children }) => {
  return (
    isOpen && (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-md relative">{children}</div>
      </div>
    )
  );
};

// Extracted button component
const Button = ({ onClick, className, children }) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

function Create({ isOpen, onClose, onBoardUpdate, boards, setBoards }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  //const [boards, setBoards] = useState([]);
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);

  useEffect(() => {
    const storedBoards = JSON.parse(window.localStorage.getItem("boards"));
    if (storedBoards) {
      setBoards(storedBoards);
    }
  }, []);

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleCloseModal = () => {
    onClose();
    setEditingBoardId(null);
    setBoardToDelete(null);
    setName("");
    setDescription("");
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
      setName("");
      setDescription("");
      updateBoards({ board: newBoard }, "add");
    } else {
      window.alert("Both Name and Description are necessary.");
    }
  };

  const handleDeleteBoard = (id) => {
    //const updatedBoards = boards.filter((board) => board.id !== id);
    console.log(id);
    updateBoards({ id: id }, "delete");
  };

  const handleEdit = (id) => {
    console.log(id);
    const boardToEdit = boards.find((board) => board._id === id);
    if (boardToEdit) {
      setName(boardToEdit.name);
      setDescription(boardToEdit.description);
      setEditingBoardId(id);
    }
  };

  const handleSaveEdit = () => {
    console.log(editingBoardId, boards);
    let updatedBoards = boards.filter((board) => board._id == editingBoardId);
    updatedBoards[0].name = name;
    updatedBoards[0].description = description;
    setName("");
    setDescription("");
    console.log(updatedBoards);
    updateBoards({ board: updatedBoards[0], id: editingBoardId }, "update");
  };

  const handleConfirmDelete = () => {
    console.log(boardToDelete);
    if (boardToDelete) {
      handleDeleteBoard(boardToDelete);
      setConfirmDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setBoardToDelete(null);
  };

  const updateBoards = (data, type) => {
    handleCloseModal();
    onBoardUpdate(data, type);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <>
          <Button
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
          </Button>
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
            onChange={(e) => handleInputChange(e, setName)}
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
            onChange={(e) => handleInputChange(e, setDescription)}
          />

          {editingBoardId ? (
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSaveEdit}
            >
              Save Edit
            </Button>
          ) : (
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleAddBoard}
            >
              Add Board
            </Button>
          )}

          <Button
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>

          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Boards:</h2>
            <ul>
              {boards?.map((board) => (
                <li key={board.id} className="mb-2 flex items-center">
                  <span className="font-semibold mr-2">{board.name}:</span>{" "}
                  {board.description}
                  <Button
                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
                    onClick={() => handleEdit(board._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => {
                      setBoardToDelete(board._id);
                      setConfirmDelete(true);
                    }}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={confirmDelete} onClose={handleCancelDelete}>
        <>
          <p className="text-xl font-semibold mb-4">Confirm Delete?</p>
          <div className="flex justify-end">
            <Button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
              onClick={handleConfirmDelete}
            >
              Yes
            </Button>
            <Button
              className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
              onClick={handleCancelDelete}
            >
              No
            </Button>
          </div>
        </>
      </Modal>
    </>
  );
}

export default Create;
