const indexRouter = require("express").Router();
import { Request, Response, NextFunction } from "express";

//importing middleware
const { ensureAuth, ensureGuest } = require("../middleware/auth");

indexRouter.get("/", ensureGuest, (req: Request, res: Response) => {
  res.render("login");
});

indexRouter.get("/log", ensureAuth, async (req: Request, res: Response) => {
  res.render("index", { userinfo: req.user });
});
module.exports = indexRouter;
