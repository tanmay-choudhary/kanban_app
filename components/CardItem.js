import React from "react";
import {
  ChevronDownIcon,
  PlusIcon,
  DotsVerticalIcon,
  ChatAlt2Icon,
  PaperClipIcon,
  PencilAltIcon,
  TrashIcon,
  ClockIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import { Draggable } from "react-beautiful-dnd";

function CardItem({ data, index, onEdit, onDelete }) {
  return (
    <Draggable index={index} draggableId={data.id.toString()}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-md p-3 m-3 mt-0 last:mb-0 relative"
        >
          {/*  <label
            className={`bg-gradient-to-r
              px-2 py-1 rounded text-white text-sm
              ${
                data.priority === 0
                  ? "from-blue-600 to-blue-400"
                  : data.priority === 1
                  ? "from-green-600 to-green-400"
                  : "from-red-600 to-red-400"
              }
              `}
          >
            {data.priority === 0
              ? "Low Priority"
              : data.priority === 1
              ? "Medium Priority"
              : "High Priority"}
            </label> */}
          <div className="flex flex-col my-3">
            <h5 className="text-md text-lg leading-6 mt-4">{data.name}</h5>
            <div className="flex flex-wrap justify-between space-y-2 mt-3">
              <div className="flex space-x-2 items-center">
                <span className="flex items-start">
                  <div style={{ width: "1.5rem" }}>
                    <InformationCircleIcon className="mt-[5px] mr-1 w-4 h-4 text-gray-500" />
                  </div>
                  <span className="flex-grow">{data.description}</span>
                </span>
              </div>

              <div>
                <span className="flex space-x-1 items-center">
                  <ClockIcon className=" w-4 h-4 text-gray-500" />
                  <span>
                    {new Date(data?.dueDate).toISOString().split("T")[0] ||
                      data.dueDate}
                  </span>
                </span>
              </div>
            </div>

            {/*  <div className="flex justify-end">
              <button
                className="text-blue-500 hover:text-blue-700 mr-2"
                onClick={() => onEdit(data.id)}
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => onDelete(data.id)}
              >
                Delete
              </button>
            </div> */}
            <div className="absolute top-0 right-0 m-2">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => onEdit(data.id)}
              >
                <PencilAltIcon className="w-5 h-5" />
              </button>
              <button
                className="text-gray-500 hover:text-gray-700 ml-2"
                onClick={() => onDelete(data.id)}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default CardItem;
