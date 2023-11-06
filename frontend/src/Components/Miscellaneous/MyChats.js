import React, { useState, useEffect } from "react";
import { chatState } from "../../context/ChatProvider";
import axios from "axios";
import { Box, useToast, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import getSender from "../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, userAuth, chats, setChats } =
    chatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      };

      const { data } = await axios.get("/api/chats", config);
      setChats(data); // fetching chats over here
    } catch (e) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the chats",
        status: "error",
        duration: 4000,
        isCloasable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      //bg="white"
      w={{ base: "100%", md: "51%" }}
      h="100%"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        textColor={"White"}
      >
        MyChats
        <GroupChatModal>
          <Button
            display="flex"
            ml={12}
            fontSize={{ base: "17px", md: "13px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"ne
        h="100%"
        fontSize={{ base: "20px", md: "20px", lg: "22px" }}
        borderRadius="lg"
        overflowY="auto"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat);
                  console.log("Selected Chat is ", selectedChat);
                }}
                cursor="pointer"
                bg={selectedChat === chat ? "orange" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={10}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  <Box key={chat._id}>
                    {
                      !chat.isGroupChat
                        ? chat.users[0]?._id === loggedUser._id
                          ? chat.users[1]?.name
                          : chat.users[0]?.name
                        : chat.chatName // else part
                    }
                  </Box>
                  {/* {!chats.isGroupChat
                    ? getSender(loggedUser, chats.users)
                    : chats.chatName} */}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
