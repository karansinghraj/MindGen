import { Request, Response } from "express";
import * as accountServices from "../services/accountServices";

async function userSignUp(req: Request, res: Response) {
  const model = req.body;
  const response = await accountServices.userSignUp(model);
  res.status(response.status).json(response);
}

async function userLogin(req: Request, res: Response) {
  const model = req.query;
  const response = await accountServices.userLogin(model);
  res.status(response.status).json(response);
}

async function signUpverification(req: Request, res: Response) {
  const model = req.query;
  const response = await accountServices.signUpverification(model);
  res.status(response.status).json(response);
}

async function resetPasswordLink(req: Request, res: Response) {
  const model = req.query;
  const response = await accountServices.resetPasswordLink(model);
  res.status(response.status).json(response);
}

async function resetPassword(req: Request, res: Response) {
  const model = req.query;
  const response = await accountServices.resetPassword(model);
  res.status(response.status).json(response);
}

export {
  userSignUp,
  userLogin,
  signUpverification,
  resetPasswordLink,
  resetPassword,
};
