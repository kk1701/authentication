const userModel = require('../models/userSchema')
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')

const signup = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    console.log( name, email, password, confirmPassword );

    try{
        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        var validEmail = emailValidator.validate(email)
        if(!validEmail){
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email'
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: 'Password and confirm password do not match.'
            })
        }

        const userInfo = userModel(req.body)
        const result = await userInfo.save()

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch(error){
        if(error.code === 11000){     //11000 - provided by mongodb => duplicate entry
            return res.status(400).json({
                success: false,
                message: "Account already exists"
            })
        }
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }

    try{
        const user = await userModel
            .findOne({
                email
            })
            .select('+password')
        
        if(!user || !await bcrypt.compare(password, user.password)){
            return res.status(400).json({
                success: false,
                message: 'Invalid Credentials'
            })
        }


        const token = user.jwtToken()
        user.password = undefined  //to prevent its leakage in cookies or anywhere else

        const cookieOptions = {
            maxAge: 24*60*60*1000,
            httpOnly: true
        }

        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            success: true,
            data: user
        })

    } catch(error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const getUser = async (req, res) => {
    const userId = req.user.id

    try{
        const user = await userModel.findById(userId)

        return res.status(200).json({
            success: true,
            data: user
        })
    } catch(error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const logout = async (req, res) => {
    try{
        const cookieOptions = {
            expires: new Date(),
            httpOnly: true
        }

        res.cookie("token", null, cookieOptions)

        res.status(200).json({
            success: true,
            message: "Logged out successfully!"
        })
    } catch(error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    signup,
    signin,
    getUser,
    logout
}
