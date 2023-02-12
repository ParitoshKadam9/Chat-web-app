const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserModel = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    img: { type: String},
},
    {
        timestamps: true
    }
);


UserModel.methods.matchPassword = async function (eP) {
    return await bcrypt.compare(eP, this.password);
}

//before saving the schema or the object

UserModel.pre('save', async function (next) {
    if (!this.isModified) {
        next() // same as continue
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
} )

const User = mongoose.model("User", UserModel);
module.exports = User;