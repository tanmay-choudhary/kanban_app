import React, { useState, useEffect } from "react";
import Modal from "react-modal";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEdit: (task: Task) => void;
  onAddClick: (name: string, description: string, dueDate: string) => void;
  editedTask: Task | null;
}

interface Task {
  name: string;
  description: string;
  dueDate: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSaveEdit, onAddClick, editedTask }: TaskModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const currentDate = new Date().toISOString().split("T")[0];
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    // Populate modal fields if an existing task is being edited
    if (editedTask) {
      setName(editedTask.name || "");
      setDescription(editedTask.description || "");
      setDueDate(
        new Date(editedTask?.dueDate).toISOString().split("T")[0] || ""
      );
    } else {
      // Reset fields if no task is being edited (for adding)
      setName("");
      setDescription("");
      setDueDate("");
    }
  }, [editedTask]);

  const handleAddClick = () => {
    if (!name || !description || !dueDate) {
      setValidationError("All fields must be filled out.");
      return;
    }

    onAddClick(name, description, dueDate);
    onClose();
  };

  const handleSaveEdit = () => {
    if (!name || !description || !dueDate) {
      setValidationError("All fields must be filled out.");
      return;
    }

    onSaveEdit({ ...editedTask, name, description, dueDate });
    onClose();
  };

  const clearValidationError = () => {
    setValidationError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Task Modal"
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
        <h2 className="text-2xl font-bold mb-4">
          {editedTask ? "Edit Task" : "Add Task"}
        </h2>
        {validationError && (
          <div className="text-red-500 mb-4">{validationError}</div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearValidationError();
            }}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearValidationError();
            }}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Due Date:</label>
          <input
            type="date"
            value={dueDate}
            min={currentDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              clearValidationError();
            }}
            className="w-full p-2 border rounded"
          />
        </div>
        {editedTask ? (
          <button
            onClick={handleSaveEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleAddClick}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Add
          </button>
        )}
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
