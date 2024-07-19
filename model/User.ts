import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  content: string;
  createAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptmessage: boolean;
  messages: Message[];
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [
      /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
      "Please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "verifyCode is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifyCodeExpiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptmessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.user as mongoose.Model<User>) || // if model is allredy created
  mongoose.model<User>("User", UserSchema); // if booting 1st time...create model

export default UserModel;
