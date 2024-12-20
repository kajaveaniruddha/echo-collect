import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  stars: number;
  content: string;
  createdAt: Date;
  sentiment: string;
  category: string[];
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 5,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  sentiment: {
    type: String,
    enum: ["positive", "negative", "neutral"],
    default: "",
    required: true,
  },
  category: {
    type: [String],
    default: [],
    required: true,
  },
});

export interface User extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  isVerified: boolean;
  introduction: string;
  questions: string[];
  message: Message[];
  messageCount: number;
  maxMessages: number;
}

const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    trim: true,
    default: "user",
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "please use a valid email"],
  },
  password: { type: String, required: [true, "Password is required"] },
  verifyCode: { type: String, required: [true, "Verify Code is required"] },
  verifyCodeExpiry: { type: Date, required: [true, "Password is required"] },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: false,
    required: [true, "isAcceptingMessage is required"],
  },
  introduction: {
    type: String,
    default:
      "I hope you're doing well.I'm reaching out to ask if you could kindly provide a short feedback about the product. Your feedback would be greatly appreciated.",
    trim: true,
  },
  questions: {
    type: [String],
    default: [
      "How much would you rate the product?",
      "What did you liked/disliked about the product?",
    ],
    trim: true,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  maxMessages: {
    type: Number,
    default: 50,
  },
  message: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model("User", UserSchema);

export default UserModel;
