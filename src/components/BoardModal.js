import React, { useState } from "react";

// Modal Component for Creating New Board (UI only)
const NewBoardModal = ({ isOpen, onClose, onCreateBoard, loading }) => {
  const [boardName, setBoardName] = useState("");

  const handleCreate = () => {
    if (!boardName.trim()) return;
    onCreateBoard(boardName); // just pass the name to parent
    setBoardName(""); // reset after creating
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#27272a] p-6 w-96 rounded-md">
        <h2 className="text-xl mb-4 text-white">Create New Board</h2>
        <input
          type="text"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          placeholder="Board Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-1 focus:ring-black text-white"
          required
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/70 hover:text-white cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !boardName.trim()}
            className="px-6 py-2 bg-gray-800 text-white rounded-md cursor-pointer"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewBoardModal;
