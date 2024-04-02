const bcrypt = require('bcrypt')

const mongoose = require('mongoose')
const { Schema } = mongoose

const JWT = require('jsonwebtoken')

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        minLength: [5, "Name must be atleast five chars."],
        maxLength: [50, "Name must be less than 50 chars."],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: [true, "Already registered email!"],
    },
    password: {
        type: String,
        select: false
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordExpiryDate: {
        type: String,
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10)
    return next()
})

userSchema.methods = {
    jwtToken() {
        return JWT.sign(
            { id: this._id, email: this.email },
            process.env.SECRET,
            { expiresIn: '24h' }
        )
    }
}

const userModel = mongoose.model('user', userSchema)

module.exports = userModel