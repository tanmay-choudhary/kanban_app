import React, { useState } from "react";
import Modal from "react-modal";

const TaskModal = ({ isOpen, onClose, onAddClick }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAddClick = () => {
    onAddClick(name, description, dueDate);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Task Modal"
      style={{
        overlay: {
          zIndex: 1000,
        },
        content: {
          zIndex: 1001,
        },
      }}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Add Task</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Due Date (optional):
          </label>
          <input
            type="date" // Change the input type to "date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Add
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default TaskModal;
