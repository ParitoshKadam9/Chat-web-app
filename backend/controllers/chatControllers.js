const asynchandler = require('express-async-handler');
const Chat = require("../modals/chatModel")
const User = require("../modals/userModel")


const accessChat = asynchandler(async (req, res) => {
    var user = req.query.other  
    var curr = req.query.name
    console.log(curr, user)

    let id1; let id2;

    id1  = await User.find({name: user})
    id2 = await User.find({ name: curr })
    
    console.log(id1[0]._id, id2[0]._id)

    if (!user) {
        console.log("user bezoo baaya");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq : id1[0]._id } } },
            { users: { $elemMatch: { $eq: id2[0]._id } } },
        ]
    }).populate("users", "-passwords").populate("latestMessage");

    console.log("1111");
    
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email",
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    }
    else {
        console.log("3333")
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [id2[0]._id, id1[0]._id],
        }

        try {
            const createdChat = await Chat.create(chatData);
            console.log(createdChat);
            const FullChat = await Chat.findOne({
              _id: createdChat._id,
            }).populate("users", "-passwords");

            res.status(200).json(FullChat)
        }
        catch (err) {
            res.status(400)
            console.log(err);
        }
    }
})

const fetchChat = asynchandler(async (req, res) => {

    let id;
    id = await User.find({ name: req.query.name })
    console.log(id[0]._id)

    try {
         Chat.find({ users: { $elemMatch: { $eq: id[0]._id } } })
        //   .populate("users, -password")
        //   .populate("groupAdmin, -password")
        //   .populate("latestMessage")
        //   .sort({ updatedAt: -1 })
          .then(async (results) => {
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: "name email",
            });
            res.status(200).send(results);
          });
    }
    catch (err) {
        res.send("nahh  ")
        console.log(err);
    }

}
)

const createGroup = asynchandler(async (req, res) => {
//   if (!req.body.users || !req.body.name) {
//     return res.status(400).send({ message: "Please Fill all the feilds" });
//   }
console.log(req.body)
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

    let user = await User.find({ name: req.query.name });
    
    users.push(user[0]._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGrp = asynchandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const removeFrmGrp = asynchandler(async (req, res) => {
   const { chatId, username } = req.body;

   let id = User.find({ name: username });
    let userId = id[0]._id;
  const removed = await Chat.findByIdAndUpdate(
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

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

const addToGrp = asynchandler(async (req, res) => {
  const { chatId, username } = req.body;

    let id = User.find({ name: username }); 
    let userId = id[0]._id;

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
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});
module.exports = { accessChat, fetchChat , createGroup, renameGrp, addToGrp, removeFrmGrp };