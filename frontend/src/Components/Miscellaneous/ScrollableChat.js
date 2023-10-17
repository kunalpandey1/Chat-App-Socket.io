import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { chatState } from "../../context/ChatProvider";
import { Tooltip, Avatar } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { userAuth } = chatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", flexDirection: "column" }} key={m._id}>
            {(isSameSender(messages, i, userAuth._id) ||
              isLastMessage(messages, i, userAuth._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            {/* Actually rendering the messages */}
            <div
              style={{
                backgroundColor: `${
                  m.sender._id === userAuth._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "10px",
                padding: "15px 15px",
                maxWidth: "100%",
                marginLeft: isSameSenderMargin(messages, m, i, userAuth._id),
                marginTop: isSameUser(messages, m, i, userAuth._id) ? 3 : 10,
              }}
            >
              <p>{m.content}</p>
              <span
                style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}
              >
                {/* adding the timestamp and date */}
                {new Date(m.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
