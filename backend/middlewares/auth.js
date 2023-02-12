// const jwt = require('jsonwebtoken');
const User = require("../modals/userModel")
const asynchandler = require('express-async-handler')

const protect = asynchandler(async (req, res, next) => {
    let id;

    if (req.headers) {
        try {
            // token = req.headers.authorization.split(" ")[1];

            // const decoded = jwt.verify(token, process.env.JWT_SALT);

            id = req.get(id);

            req.user = await User.findById(id).select("-password"); //define user without the password and since we have created user variable in the req object, we can access it in the cntroller
            next();
        }
        catch (err) {
            res.status(401);
            res.send("Not Authorized")
        }
    }
    if (!token) {
        res.status(401);
        res.send("no token da");
    }
})

module.exports={protect}