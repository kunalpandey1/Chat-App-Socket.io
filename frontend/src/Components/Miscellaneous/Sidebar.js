import React, { useState } from "react";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Input,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { chatState } from "../../context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/hooks";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import axios from "axios";
import { Spinner } from "@chakra-ui/spinner";

const Sidebar = () => {
  const [search, setSearch] = useState();
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const navigate = useNavigate();
  const {
    userAuth,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = chatState(); // destructuring the userAuth from chatState context
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "please Enter something to search",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setsearchResult(data);
    } catch (er) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "content-type": "application/json", // as we are sending data in json format
          Authorization: `Bearer ${userAuth.token}`,
        },
      };

      const { data } = await axios.post("/api/chats", { userId }, config);

      // if the chat is already being created then append that chat to access chat
      if (!chats.find((c) => c._id === data.id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoading(false);
      onClose();
    } catch (err) {
      toast({
        title: "Error fetching the chat",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        width="100%"
        padding="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="work sans">
          GigSync Chat
        </Text>
        <div>
          <Menu>
            <MenuButton padding="1">
              <BellIcon fontSize="2xl" m="1" />
            </MenuButton>
            {/* notification ui */}
            <MenuList pl={2}>
              {!notifications.length && "No New Messages"}
              {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotifications(notifications.filter((n) => n !== notif)); // remove the notification after clicking
                  }}
                >
                  {notif.chat.isGroupChat
                    ? ` New Message in ${notif.chat.chatName}`
                    : `New Message from ${
                        !notif.chat.isGroupChat
                          ? notif.chat.users[0]?._id === userAuth._id
                            ? notif.chat.users[1]?.name
                            : notif.chat.users[0]?.name
                          : notif.chat.chatName
                      }`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={userAuth.name} />
            </MenuButton>
            <MenuList>
              <ProfileModel userAuth={userAuth}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              //optional chaining
              searchResult?.map((userAuth) => (
                <UserListItem
                  key={userAuth._id}
                  userAuth={userAuth}
                  handleFunction={() => accessChat(userAuth._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;

/* 
Optional Chaining 


 searchResult?.map((userAuth) => (
                <UserListItem
                  key={userAuth._id}
                  userAuth={userAuth}
                  handleFunction={() => accessChat(userAuth._id)}

Optional chaining is a feature introduced in JavaScript to simplify and make code more concise when working with properties or methods of objects that may not exist or be undefined. It uses the ?. syntax to safely access nested properties or call methods without causing an error if any intermediate property in the chain is null or undefined.

 Optional chaining simplifies code and makes it more robust by automatically handling null or undefined values in the chain. It's particularly useful when dealing with data received from APIs or when working with complex object structures where not all properties are guaranteed to exist */
