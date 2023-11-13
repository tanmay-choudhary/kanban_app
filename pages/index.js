import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import DragDrop from "@/components/DragDrop";
import Modals from "@/components/Modals";
import Loader from "@/components/Loader";
import makeApiCalls from "@/utils/makeApiCalls";

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
  const [isData, setIsData] = useState(true);
  const [editedTask, setEditedTask] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [loading, setLoading] = useState(true);
  ///////////////////////////////////////////////////////////////////////////////////

  const handleEditTask = (taskId) => {
    const taskToEdit = boardData.kanbans
      .flatMap((kanban) => kanban.items)
      .find((item) => item.id === taskId);

    if (taskToEdit) {
      setEditedTask(taskToEdit);
      setShowEditTaskModal(true); // Open the edit task modal
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
    console.log(updatedBoardData);
    async function helper() {
      const updateKanban =
        (await makeApiCalls(
          "PATCH",
          `/tasks/${updatedBoardData._id}`,
          updatedBoardData
        )) || [];
    }
    helper();
    setBoardData(updatedBoardData);
    setEditedTask(null);
  };
  const onBoardUpdate = (data, type) => {
    console.log(type);
    async function helper(req, url, payload) {
      await makeApiCalls(req, url, payload);
      const storedBoards = (await makeApiCalls("GET", "/kanban"))?.data || [];
      //console.log(storedBoards);
      setBoards(storedBoards);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
    if (type == "add") {
      setLoading(true);
      helper("POST", "/kanban", data.board);
    } else if (type == "delete") {
      setLoading(true);
      helper("DELETE", `/kanban/${data.id}`, data.board);
    } else if (type == "update") {
      setLoading(true);
      helper("PATCH", `/kanban/${data.id}`, data.board);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    try {
      async function helper() {
        try {
          setLoading(true);
          const storedBoards =
            (await makeApiCalls("GET", "/kanban"))?.data || [];
          console.log(storedBoards);
          setBoards(storedBoards);
          setBoardData(storedBoards[0]);
          if (storedBoards[0]) {
            setIsData(true);
          } else {
            setIsData(false);
          }
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        } catch (e) {
          console.log(e);
        }
      }
      helper();
    } catch (error) {
      console.error("Error parsing stored boards:", error);
    }
  }, []);

  useEffect(() => {
    if (process.browser) {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    console.log(boardData, boards);
    async function helper() {
      setLoading(true);
      const storedBoards = (await makeApiCalls("GET", "/kanban"))?.data || [];
      if (storedBoards[0]) {
        setBoardData(storedBoards[0]);
        setIsData(true);
      } else {
        setIsData(false);
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
    helper();
  }, [boards]);

  /////////////////////////////////////////////////////////////////////////
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
      board._id === newBoardData._id ? newBoardData : board
    );
    //console.log(newBoardData);
    //window.localStorage.setItem("boards", JSON.stringify(tempData));
    async function helper() {
      const updateKanban =
        (await makeApiCalls(
          "PATCH",
          `/tasks/${newBoardData._id}`,
          newBoardData
        )) || [];
    }
    helper();
    //setBoards(tempData);
  };

  const openModal = (boardId) => {
    setSelectedBoard(boardId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const closeEditModel = () => {
    setShowEditTaskModal(false);
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
    //console.log(selectedBoard, newBoardData);
    newBoardData.kanbans[selectedBoard].items.push(item);
    setBoardData({ ...newBoardData });

    let tempData = boards.map((board) =>
      board._id === newBoardData._id ? newBoardData : board
    );
    //console.log(newBoardData);
    async function helper() {
      const updateKanban =
        (await makeApiCalls(
          "PATCH",
          `/tasks/${newBoardData._id}`,
          newBoardData
        )) || [];
    }
    helper();
    //window.localStorage.setItem("boards", JSON.stringify(tempData));
    //setBoards(tempData);
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
      async function helper() {
        const updateKanban =
          (await makeApiCalls(
            "PATCH",
            `/tasks/${updatedBoardData._id}`,
            updatedBoardData
          )) || [];
      }
      helper();
      //.setItem("boards", JSON.stringify(boards));
    }
  };
  /////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Layout>
          <div className="p-10 flex flex-col h-screen">
            <div className="flex flex-initial justify-between">
              {!isData && (
                <Button name="Create Board" onClick={openCreateModal} />
              )}
            </div>

            {isData && ready && (
              <>
                <div className="flex flex-initial justify-between">
                  <Button name="Add Board" onClick={openCreateModal} />
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
                <DragDrop
                  onDragEnd={onDragEnd}
                  boardData={boardData}
                  handleEditTask={handleEditTask}
                  handleDeleteTask={handleDeleteTask}
                  openModal={openModal}
                />
              </>
            )}
            {!isData && (
              <img src="/nodata.jpg" alt="company" width="800" height="200" />
            )}
            <Modals
              showModal={showModal}
              showEditTaskModal={showEditTaskModal}
              showCreateModal={showCreateModal}
              closeCreateModal={closeCreateModal}
              onBoardUpdate={onBoardUpdate}
              boards={boards}
              setBoards={setBoards}
              handleSaveEdit={handleSaveEdit}
              onAddClick={onAddClick}
              closeModal={closeModal}
              editedTask={editedTask}
              closeEditModel={closeEditModel}
            />
          </div>
        </Layout>
      )}
    </>
  );
}
