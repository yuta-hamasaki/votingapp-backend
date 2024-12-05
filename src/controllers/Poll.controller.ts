import { Request, Response } from "express";
import Poll from "../models/Poll.models";
import { IPoll } from "../models/Poll.models";



export const createPoll = async (req: Request, res: Response)=>{
  try{
    const {question, description, options} = req.body
    const authorId = (req as any).user.id;
    const poll = new Poll ({
      question, description, options, authorId
    })
  await poll.save()
  res.status(200).json({message:"created"})
}catch(err){
  console.error(err)
  res.status(400).json({messgae: "could not create"})
}}

export const getPolls = async (req: Request, res: Response)=>{
  try{
    const polls = await Poll.find()
    res.json(polls)
  }catch(err){
    res.status(400).json({message: "poll not found"})
  }
}

export const pollDetail = async (req: Request, res: Response)=>{
  try{
    const {id} = req.params
    const page = await Poll.findById(id)
    res.json(page)
  }catch{
    res.status(404).json({message: "not found"})
  }

}


export const votePoll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { index } = req.body; 

    const poll = await Poll.findById(id);

    if(poll){ 
    poll.options[index].votes++;
    await poll.save();
    res.status(200).json(poll);
  }

  res.status(404).json({message: "not found"})
  } catch (error) {
    console.error("Vote poll error:", error);
    res.status(500).json({ 
      message: "Server error during voting"
  })
};
}

export const updatePoll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "ユーザーが認証されていません" });
    }

    const poll = await Poll.findById(id) as IPoll;

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.authorId.toString() !== userId) {
      return res.status(403).json({ message: "この操作は許可されていません" });
    }

    const updatedPoll = await Poll.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updatedPoll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating poll" });
  }
};


export const deletePoll = async(req: Request, res: Response)=>{
  try {
    const {id} = req.params
    const poll = await Poll.findByIdAndDelete(id) as IPoll
    const userId = (req as any).user?.id;

    if (poll.authorId.toString() !== userId) {
      return res.status(403).json({ message: "この操作は許可されていません" });
    }

    
    res.status(200).json(poll)
  } catch (error) {
    res.status(500).json({
      message:"faild deleting"
    })
  }
}