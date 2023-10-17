const asyncHandler = require("express-async-handler");

const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
// it is responsible for creating or fetching a one on one chat .The user who is logged in will take the userID to create the chat
const accessChats = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false, //obviously group chat will be false as this is one on one chat
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, // current user loggedin
      { users: { $elemMatch: { $eq: req.userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  populateChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (populateChat.length > 0) {
    res.send(populateChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupCHat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    // Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).then((result) =>
    //   res.send(result)
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 }) // sort with respect to updatedAt (New to Old)
      .then(async (results) => {
        // 'results' here represents the result of the resolved Promise returned by Chat.find(...)
        store = await User.populate(results, {
          //path tells Mongoose where to find the field that needs to be populated within the results object. It specifies the nested path to the field you want to populate.
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(store);
      });
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "please fill all the fields" });
  }

  var groupusers = JSON.parse(req.body.users); // we will send in the stringify format from the frontend and we will parse it and make it as object in the backend

  if (groupusers.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  groupusers.push(req.user); // all the users I am pushing and also the currently logged in user

  try {
    const groupchat = await Chat.create({
      chatName: req.body.name,
      users: groupusers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullgroupchat = await Chat.findOne({
      _id: groupchat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullgroupchat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, newName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: newName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not Found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(400);
    throw new Error("user not added");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const remove = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!remove) {
    res.status(400);
    throw new Error("user not removed");
  } else {
    res.json(remove);
  }
});

module.exports = {
  accessChats,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
