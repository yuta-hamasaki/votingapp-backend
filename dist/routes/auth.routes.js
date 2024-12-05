"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_controller_1 = require("../controllers/Auth.controller");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", Auth_controller_1.register);
authRouter.post("/login", Auth_controller_1.login);
exports.default = authRouter;
