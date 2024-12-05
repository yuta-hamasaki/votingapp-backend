import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";


export interface img{
  img: 1|2|3|4|5
}

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  imageNum: img
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageNum: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
