import mongoose, { Schema, Document, Types } from "mongoose";


export interface IPoll extends Document {
  question: string;
  description?: string;
  options: { text: string; votes: number }[];
  authorId: Types.ObjectId;
}

const PollSchema = new Schema<IPoll>({
  question: { type: String, required: true },
  description:{type: String},
  options: [
    {
      text: { type: String, required: true },
      votes: { type: Number, default: 0 },
    },
  ],
  authorId: {type: Schema.Types.ObjectId, required: true, ref: "User" }
});

const Poll = mongoose.model<IPoll>("Poll", PollSchema);
export default Poll