import Head from "next/head";
import Layout from "../components/Layout";
import {
  ChevronDownIcon,
  PlusIcon,
  DotsVerticalIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import CardItem from "../components/CardItem";
import BoardData from "../data/board-data.json";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import TaskModal from "@/components/TaskModal";
import CreateModal from "@/components/CreateModal";

function createGuidId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [boardData, setBoardData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setCreateShowModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(0);
  const [boards, setBoards] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const handleEditTask = (taskId) => {
    // Find the task in the current boardData
    const taskToEdit = boardData.kanbans
      .flatMap((kanban) => kanban.items)
      .find((item) => item.id === taskId);

    if (taskToEdit) {
      // Set the task details to state for editing
      setEditingTask(taskToEdit);
    }
  };

  const handleSaveEdit = (editedTask) => {
    // Update the task in the boardData
    const updatedBoardData = { ...boardData };

    for (let i = 0; i < updatedBoardData.kanbans.length; i++) {
      const kanban = updatedBoardData.kanbans[i];
      const index = kanban.items.findIndex((item) => item.id === editedTask.id);

      if (index !== -1) {
        kanban.items[index] = editedTask;
        break;
      }
    }

    // Update state and local storage
    setBoardData(updatedBoardData);
    window.localStorage.setItem("boards", JSON.stringify(boards));

    // Reset editing state
    setEditingTask(null);
  };
  const onBoardUpdate = (updatedBoards) => {
    setBoards(updatedBoards);
    window.localStorage.setItem("boards", JSON.stringify(updatedBoards));
  };
  useEffect(() => {
    try {
      const storedBoards =
        JSON.parse(window.localStorage.getItem("boards")) || [];
      setBoards(storedBoards);
      setBoardData(
        storedBoards[0] || {
          id: Date.now(),
          name: "Initial Card",
          description: "",
          kanbans: [
            { name: "todo", items: [] },
            { name: "in_progress", items: [] },
            { name: "completed", items: [] },
          ],
        }
      );
    } catch (error) {
      console.error("Error parsing stored boards:", error);
    }
  }, []);

  useEffect(() => {
    if (process.browser) {
      setReady(true);
    }
  }, []);

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;

    const { droppableId: sourceId, index: sourceIndex } = source;
    const { droppableId: destId, index: destIndex } = destination;

    let newBoardData = { ...boardData };
    const dragItem = newBoardData.kanbans[sourceId].items[sourceIndex];

    newBoardData.kanbans[sourceId].items.splice(sourceIndex, 1);
    newBoardData.kanbans[destId].items.splice(destIndex, 0, dragItem);

    setBoardData({ ...newBoardData });

    let tempData = boards.map((board) =>
      board.id === newBoardData.id ? newBoardData : board
    );

    window.localStorage.setItem("boards", JSON.stringify(tempData));
    setBoards(tempData);
  };

  const openModal = (boardId) => {
    setSelectedBoard(boardId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeCreateModal = () => {
    setCreateShowModal(false);
  };

  const onAddClick = (name, description, dueDate) => {
    const item = {
      id: createGuidId(),
      name: name,
      description: description,
      dueDate: dueDate,
    };

    let newBoardData = { ...boardData };
    newBoardData.kanbans[selectedBoard].items.push(item);
    setBoardData({ ...newBoardData });

    let tempData = boards.map((board) =>
      board.id === newBoardData.id ? newBoardData : board
    );

    window.localStorage.setItem("boards", JSON.stringify(tempData));
    setBoards(tempData);
    closeModal();
  };

  const openCreateModal = () => {
    setCreateShowModal(true);
  };

  const handleDeleteTask = (taskId) => {
    // Confirm deletion and then update the state and local storage
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      const updatedBoardData = { ...boardData };

      // Iterate through kanbans to find and remove the task
      for (let i = 0; i < updatedBoardData.kanbans.length; i++) {
        updatedBoardData.kanbans[i].items = updatedBoardData.kanbans[
          i
        ].items.filter((item) => item.id !== taskId);
      }

      // Update state and local storage
      setBoardData(updatedBoardData);
      window.localStorage.setItem("boards", JSON.stringify(boards));
    }
  };
  return (
    <Layout>
      <div className="p-10 flex flex-col h-screen">
        <div className="flex flex-initial justify-between">
          <Button name="Create Board" onClick={openCreateModal} />
        </div>
        <div className="flex flex-initial justify-between">
          <Dropdown
            options={boards}
            onSelect={(option) =>
              console.log("Selected option:", option, boardData)
            }
            id={boardData?.id}
            setBoardData={setBoardData}
            boards={boards}
          />
        </div>

        {ready && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-4 gap-5 my-5">
              {boardData.kanbans.map((board, bIndex) => (
                <div key={board.name}>
                  <Droppable droppableId={bIndex.toString()}>
                    {(provided, snapshot) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <div
                          className={`bg-gray-100 rounded-md shadow-md
                            flex flex-col relative overflow-hidden
                            ${snapshot.isDraggingOver && "bg-green-100"}`}
                        >
                          <h4 className="p-3 flex justify-between items-center mb-2">
                            <span className="text-2xl text-gray-600">
                              {board.name}
                            </span>
                            <DotsVerticalIcon className="w-5 h-5 text-gray-500" />
                          </h4>

                          <div
                            className="overflow-y-auto overflow-x-hidden h-auto"
                            style={{ maxHeight: "calc(100vh - 290px)" }}
                          >
                            {board.items.length > 0 &&
                              board.items.map((item, iIndex) => (
                                <CardItem
                                  key={item.id}
                                  data={item}
                                  index={iIndex}
                                  onEdit={handleEditTask}
                                  onDelete={handleDeleteTask}
                                  className="m-3"
                                />
                              ))}
                            {provided.placeholder}
                          </div>

                          <button
                            className="flex justify-center items-center my-3 space-x-2 text-lg"
                            onClick={() => openModal(bIndex)}
                          >
                            <span>Add task</span>
                            <PlusCircleIcon className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}

        <TaskModal
          isOpen={showModal}
          onClose={closeModal}
          onAddClick={onAddClick}
        />
        <TaskModal
          isOpen={showModal}
          onClose={closeModal}
          onSaveEdit={handleSaveEdit}
          onAddClick={onAddClick}
          editedTask={editedTask}
        />
        <CreateModal
          isOpen={showCreateModal}
          onClose={closeCreateModal}
          onBoardUpdate={onBoardUpdate}
        />
      </div>
    </Layout>
  );
}
