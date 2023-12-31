import React, { useState, useEffect, ChangeEvent } from "react";
import makeApiCalls from "@/utils/makeApiCalls";

interface KanbanItem {
  name: string;
  items: any[]; // Adjust the type based on your actual item structure
}

interface Board {
  id: number;
  name: string;
  description: string;
  kanbans: KanbanItem[];
}

function Create() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    async function helper() {
      const storedBoards = (await makeApiCalls("GET", "/kanban"))?.data || [];
      setBoards(storedBoards);
    }
    helper();
  }, []);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleAddBoard = () => {
    if (name && description) {
      const newBoard: Board = {
        id: Date.now(),
        name,
        description,
        kanbans: [
          {
            name: "todo",
            items: [],
          },
          {
            name: "in_progress",
            items: [],
          },
          {
            name: "completed",
            items: [],
          },
        ],
      };

      const updatedBoards = [...boards, newBoard];
      setBoards(updatedBoards);
      //window.localStorage.setItem("boards", JSON.stringify(updatedBoards));
      setName("");
      setDescription("");
    }
  };

  const handleDeleteBoard = (id: number) => {
    const updatedBoards = boards.filter((board) => board.id !== id);
    setBoards(updatedBoards);
    //window.localStorage.setItem("boards", JSON.stringify(updatedBoards));
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
