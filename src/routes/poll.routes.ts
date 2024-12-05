import {Router} from "express";
import { Request, Response, NextFunction } from 'express';
import {createPoll, getPolls,pollDetail, votePoll, deletePoll, updatePoll} from "../controllers/Poll.controller" 
import { authMiddleware } from "../middleware/authMiddleware";

const pollRouter = Router();

const asyncMiddleware = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// router.post("/", authMiddleware, createPoll);
pollRouter.post('/', asyncMiddleware(authMiddleware), createPoll)
pollRouter.get("/", getPolls);
pollRouter.get('/:id', pollDetail)
pollRouter.post("/:id/vote", votePoll);
pollRouter.put("/:id", asyncMiddleware(authMiddleware), asyncMiddleware((updatePoll)));
pollRouter.delete("/:id", asyncMiddleware((authMiddleware)), asyncMiddleware(deletePoll));

export default pollRouter;