import React from "react";
import { Box, Text, Avatar } from "@chakra-ui/react";

const UserListItem = ({ userAuth, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      width="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="xl"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={userAuth.name}
        src={userAuth.pic}
      />
      <Box>
        <Text>{userAuth.name}</Text>
        <Text fontSize="xs">
          <b>Email:</b>
          {userAuth.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
