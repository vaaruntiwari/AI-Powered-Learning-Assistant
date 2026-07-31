import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

//@desc Register new user
//@route POST /api/auth/register
//@acess Public

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const userExits = await User.findOne({ $or: [{ email }] });

    if (userExits) {
      return res.status(400).json({
        sucess: false,
        error:
          userExists.email === email
            ? "Email already registered"
            : "Username already exists",
        statusCode: 400,
      });
    }

    //Create User

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      sucess: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
        token,
      },
      message: "User registered sucessfully",
    });
  } catch (error) {
    next(error);
  }
};

//@desc login user
//@route POST /api/auth/login
//@acess Public

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validate input

    if (!email || !password) {
      return res.status(400).json({
        sucess: false,
        error: "Please provide email and password",
        statusCode: 400,
      });
    }

    //Check for user(include password for comparision)

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        sucess: false,
        error: "User not found",
        statusCode: 401,
      });
    }

    //Check password
    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return res.status(401).json({
        sucess: false,
        error: "Invalid credentials",
        statusCode: 401,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      sucess: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
      token,
      message: "Login sucessful",
    });
  } catch (error) {
    next(error);
  }
};

//@desc Get user profile
//@route GET /api/auth/profile
//@acess Private

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      sucess: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

//@desc Update user profile
//@route PUT /api/auth/profile
//@acess Private

export const updateProfile = async (req, res, next) => {
    try {
        const {username, email, profileImage}=req.body

        const user=await User.findById(req.user._id)

        if(username) user.username=username
        if(email) user.email=email
        if(profileImage) user.profileImage=profileImage

        await user.save()

        res.status(200).json({
            sucess:true,
            data:{
            id:user._id,
            username:user.username,
            email:user.email,
            profileImage:user.profileImage
            },
            message:"Profile Updated Sucessfully"
        })

    } catch (error) {
        next(error)
    }
};

//@desc Change user password
//@route POST /api/auth/change-password
//@acess Private

export const changePassword = async (req, res, next) => {

    try {
        const {currentPassword, newPassword}=req.body

        if(!currentPassword || !newPassword){
            return res.status(400).json({
                sucess:false,
                error:'Please provide current and new password',
                statusCode:400
            })
        }

        const user=await User.findById(req.user._id).select('+password')

        //Check currentPassword

        const isMatch=await user.matchPasswords(currentPassword)

        if(!isMatch){
            return res.status(401).json({
                sucess:false,
                error:'Current password is incorrect',
                statusCode:401

            })
        }

        //Update password
        user.password=newPassword
        await user.save()

        res.status(200).json({
            sucess:true,
            message:"Password changed sucessfully"
        })
    } catch (error) {
        
    }
};
