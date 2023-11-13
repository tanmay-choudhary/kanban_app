import React from "react";
import CreateModal from "@/components/CreateModal";
import TaskModal from "@/components/TaskModal";

function Modals({
  showModal,
  showEditTaskModal,
  showCreateModal,
  closeCreateModal,
  onBoardUpdate,
  boards,
  setBoards,
  handleSaveEdit,
  onAddClick,
  closeModal,
  editedTask,
  closeEditModel,
}) {
  return (
    <>
      {" "}
      {showModal && (
        <TaskModal
          isOpen={showModal}
          onClose={() => closeModal()}
          onSaveEdit={handleSaveEdit}
          onAddClick={onAddClick}
        />
      )}
      {showEditTaskModal && (
        <TaskModal
          isOpen={showEditTaskModal}
          onClose={() => closeEditModel()}
          onSaveEdit={handleSaveEdit}
          onAddClick={onAddClick}
          editedTask={editedTask}
        />
      )}
      <CreateModal
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        onBoardUpdate={onBoardUpdate}
        boards={boards}
        setBoards={setBoards}
      />
    </>
  );
}

export default Modals;
