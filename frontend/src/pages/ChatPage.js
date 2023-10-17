import React, { useEffect, useState } from "react";
import axios from "axios";
import { chatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import Sidebar from "../Components/Miscellaneous/Sidebar";
import MyChats from "../Components/Miscellaneous/MyChats";
import ChatBox from "../Components/Miscellaneous/ChatBox";

const ChatPage = () => {
  const { userAuth } = chatState();

  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {userAuth && <Sidebar />}
      {/* giving space between Mychats and ChatBox */}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        padding="10px"
      >
        {userAuth && <MyChats fetchAgain={fetchAgain} />}
        {userAuth && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;

/*const ChatPage = () => {
  const [Chats, setChats] = useState([]);
  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat");
      setChats(data);
    } catch (error) {
      console.log("Error fetching chat data:", error);
    }
  };
  useEffect(() => {
    fetchChats();
  }, []);
  return (
    <div>
      {Chats.map((chat) => {
        <div key={chat._id}>{chat.chatName}</div>;
      })}
    </div>
  );
};

export default ChatPage;*/
