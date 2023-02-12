const User = require("../modals/userModel")
const generateToken = require("../config/generateToken")

//////////////////////////
const regUser = async (req, res) => {
    const { name, email, password, img } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all details");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        res.send("user Already Exists")
    }

    const user = await User.create({
        name, email, password, img
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            img: user.img,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Error")
    }
}
/////////////////////////

const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
       res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            img: user.img,
            token: generateToken(user._id)
        })
    } else if(user){
        res.status(401);
        res.send("incorrect password");
    }
    else {
        res.status(401);
        res.send("no such user ")
    }
}

///////////////////////QUERIES

const allUsers = async( req, res)=>{
    const keyword = req.query.search ?
        {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    } : {};

    const users = await User.find(keyword).find({name:{$ne:req.query.name}}) // we defined user in the req object in the protect middleware
    res.send(users);
    // console.log(keyword)
}

module.exports = { regUser, authUser , allUsers};