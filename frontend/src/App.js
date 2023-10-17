import "./App.css";
import { Button, ButtonGroup } from "@chakra-ui/react";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
