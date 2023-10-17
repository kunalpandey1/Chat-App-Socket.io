import React, { Children } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Button,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { Image, Text } from "@chakra-ui/react";

/*useDisclosure Hook:

The useDisclosure hook is used to manage the state of the modal. It returns three values: isOpen, onOpen, and onClose, which are destructured from the hook's return value.

isOpen is a boolean representing whether the modal is currently open.
onOpen is a function that opens the modal when called.
onClose is a function that closes the modal when called. */

const ProfileModel = ({ userAuth, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="300px">
          <ModalHeader
            fontSize={"20px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {userAuth.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Image borderRadius={"full"} boxSize={"100px"} src={userAuth.pic} />
          </ModalBody>
          <Text
            fontSize={{ base: "25px", md: "30px" }}
            fontFamily={"Work sans"}
            ml={"20"}
          >
            Email:{userAuth.email}
          </Text>
          <ModalFooter mr={"55"}>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;
