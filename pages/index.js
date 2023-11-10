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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import TaskModal from "@/components/TaskModal";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

function createGuidId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [boardData, setBoardData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(0);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const storedBoards = JSON.parse(window.localStorage.getItem("boards"));
    console.log(storedBoards);
    if (storedBoards) {
      setBoards(storedBoards);
      setBoardData(storedBoards[0]);
    } else {
      setBoards([]);
      setBoardData({
        id: Date.now(),
        name: "Initial Card",
        description: "",
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
      });
    }
  }, []);

  useEffect(() => {
    if (process.browser) {
      setReady(true);
    }
  }, []);

  const onDragEnd = (re) => {
    if (!re.destination) return;
    let newBoardData = boardData;
    var dragItem =
      newBoardData.kanbans[parseInt(re.source.droppableId)].items[
        re.source.index
      ];
    newBoardData.kanbans[parseInt(re.source.droppableId)].items.splice(
      re.source.index,
      1
    );
    newBoardData.kanbans[parseInt(re.destination.droppableId)].items.splice(
      re.destination.index,
      0,
      dragItem
    );
    setBoardData(newBoardData);
    let tempData = boards;
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i].id == newBoardData.id) {
        tempData[i] = newBoardData;
      }
    }
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

  const onAddClick = (name, description, dueDate) => {
    const item = {
      id: createGuidId(),
      name: name,
      description: description,
      dueDate: dueDate,
    };

    let newBoardData = boardData;
    newBoardData.kanbans[selectedBoard].items.push(item);
    console.log(newBoardData);
    setBoardData(newBoardData);
    let tempData = boards;
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i].id == newBoardData.id) {
        tempData[i] = newBoardData;
      }
    }
    window.localStorage.setItem("boards", JSON.stringify(tempData));
    setBoards(tempData);
    closeModal(); // Close the modal after adding data
  };

  return (
    <Layout>
      <div className="p-10 flex flex-col h-screen">
        {/* Board header */}
        <div className="flex flex-initial justify-between">
          <Button name="Create Board" url="/create-board" />
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

        {/* Board columns */}
        {ready && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-4 gap-5 my-5">
              {boardData.kanbans.map((board, bIndex) => {
                return (
                  <div key={board.name}>
                    <Droppable droppableId={bIndex.toString()}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
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
                );
              })}
            </div>
          </DragDropContext>
        )}

        {/* Task Modal */}
        <TaskModal
          isOpen={showModal}
          onClose={closeModal}
          onAddClick={onAddClick}
        />
      </div>
    </Layout>
  );
}
