import React, { useState } from "react";
import GameBoardsListAdmin from "../components/Admin/GameBoardsListAdmin";
import AdminNav from "../components/Navigation/AdminNav";

// Page for browsing all game boards, with admin switch
function AdminDashboard() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [input, setInput] = useState("");

  return (
    <>
      <AdminNav />
    </>
  );
}

export default AdminDashboard;
