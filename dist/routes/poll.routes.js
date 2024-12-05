"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Poll_controller_1 = require("../controllers/Poll.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const pollRouter = (0, express_1.Router)();
const asyncMiddleware = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
// router.post("/", authMiddleware, createPoll);
pollRouter.post('/', asyncMiddleware(authMiddleware_1.authMiddleware), Poll_controller_1.createPoll);
pollRouter.get("/", Poll_controller_1.getPolls);
pollRouter.get('/:id', Poll_controller_1.pollDetail);
pollRouter.post("/:id/vote", Poll_controller_1.votePoll);
pollRouter.put("/:id", asyncMiddleware(authMiddleware_1.authMiddleware), asyncMiddleware((Poll_controller_1.updatePoll)));
pollRouter.delete("/:id", asyncMiddleware((authMiddleware_1.authMiddleware)), asyncMiddleware(Poll_controller_1.deletePoll));
exports.default = pollRouter;
