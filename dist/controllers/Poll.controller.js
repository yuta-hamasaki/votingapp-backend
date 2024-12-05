"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePoll = exports.updatePoll = exports.votePoll = exports.pollDetail = exports.getPolls = exports.createPoll = void 0;
const Poll_models_1 = __importDefault(require("../models/Poll.models"));
const createPoll = async (req, res) => {
    try {
        const { question, description, options } = req.body;
        const authorId = req.user.id;
        const poll = new Poll_models_1.default({
            question, description, options, authorId
        });
        await poll.save();
        res.status(200).json({ message: "created" });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ messgae: "could not create" });
    }
};
exports.createPoll = createPoll;
const getPolls = async (req, res) => {
    try {
        const polls = await Poll_models_1.default.find();
        res.json(polls);
    }
    catch (err) {
        res.status(400).json({ message: "poll not found" });
    }
};
exports.getPolls = getPolls;
const pollDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const page = await Poll_models_1.default.findById(id);
        res.json(page);
    }
    catch {
        res.status(404).json({ message: "not found" });
    }
};
exports.pollDetail = pollDetail;
const votePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const { index } = req.body;
        const poll = await Poll_models_1.default.findById(id);
        if (poll) {
            poll.options[index].votes++;
            await poll.save();
            res.status(200).json(poll);
        }
        res.status(404).json({ message: "not found" });
    }
    catch (error) {
        console.error("Vote poll error:", error);
        res.status(500).json({
            message: "Server error during voting"
        });
    }
    ;
};
exports.votePoll = votePoll;
const updatePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "ユーザーが認証されていません" });
        }
        const poll = await Poll_models_1.default.findById(id);
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }
        if (poll.authorId.toString() !== userId) {
            return res.status(403).json({ message: "この操作は許可されていません" });
        }
        const updatedPoll = await Poll_models_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        res.status(200).json(updatedPoll);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating poll" });
    }
};
exports.updatePoll = updatePoll;
const deletePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const poll = await Poll_models_1.default.findByIdAndDelete(id);
        const userId = req.user?.id;
        if (poll.authorId.toString() !== userId) {
            return res.status(403).json({ message: "この操作は許可されていません" });
        }
        res.status(200).json(poll);
    }
    catch (error) {
        res.status(500).json({
            message: "faild deleting"
        });
    }
};
exports.deletePoll = deletePoll;
