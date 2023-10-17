import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ userAuth, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="md"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="orange"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
    >
      {userAuth.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
