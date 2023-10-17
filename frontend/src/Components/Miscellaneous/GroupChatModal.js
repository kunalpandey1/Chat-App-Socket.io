import { useState, React } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Box,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { chatState } from "../../context/ChatProvider";
import { useToast } from "@chakra-ui/react";
import UserListItem from "./UserListItem";
import axios from "axios";
import UserBadgeItem from "./UserBadgeItem";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [SelectedUsers, setSelectedUsers] = useState([]);
  const [Search, setSearch] = useState();
  const [SearchResult, setSearchResult] = useState([]);
  const [Loading, setLoading] = useState(false);

  const toast = useToast();

  const { userAuth, chats, setChats } = chatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      toast({
        title: "please Enter something to search",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${Search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !SelectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(SelectedUsers.map((user) => user._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Failed to create GroupChat",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    console.log("userToAdd:", userToAdd);
    console.log("SelectedUsers:", SelectedUsers);

    if (SelectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setSelectedUsers([userToAdd, ...SelectedUsers]);
  };

  const handleDelete = (deluser) => {
    setSelectedUsers(
      SelectedUsers.filter((select) => select._id !== deluser._id)
    );
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily={"work sans"}
            display="flex"
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Milan , Mueez , Kunal"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* rendering the SelectedUsers to handle the Group*/}
            <Box width="100%" display="flex" flexWrap={"wrap"} pb={3}>
              {SelectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  userAuth={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {/* rendering the SearchResult */}
            {Loading ? (
              <div>loading</div>
            ) : (
              SearchResult?.slice(0, 4).map((userAuth) => (
                <UserListItem
                  key={userAuth._id}
                  userAuth={userAuth}
                  handleFunction={() => handleGroup(userAuth)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
