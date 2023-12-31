import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {
  ChevronDownIcon,
  PlusIcon,
  DotsVerticalIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import CardItem from "../components/CardItem";
import BoardData from "../data/board-data.json";

function DragDrop({
  onDragEnd,
  boardData,
  handleEditTask,
  handleDeleteTask,
  openModal,
}) {
  return (
    <>
      {" "}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-5 my-5">
          {boardData?.kanbans?.map((board, bIndex) => (
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
                          {board.name === "todo"
                            ? "Todo"
                            : board.name === "in_progress"
                            ? "In Progress"
                            : "Completed"}
                        </span>
                      </h4>

                      <div
                        className="overflow-y-auto overflow-x-hidden h-auto"
                        style={{
                          maxHeight: "calc(100vh - 290px)",
                        }}
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

                      <div
                        className="flex justify-center items-center my-3 mx-8 space-x-2 px-3 py-2 bg-yellow-500 rounded-2xl cursor-pointer hover:scale-105"
                        onClick={() => openModal(bIndex)}
                      >
                        <button className=" text-lg  text-white">
                          Add task
                        </button>
                        <PlusCircleIcon className="ml-2 mt-1 w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}

export default DragDrop;
