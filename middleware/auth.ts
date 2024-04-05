import { Request, Response, NextFunction } from "express";

module.exports = {
  // if user is authenticated the redirected to next page else redirect to login page
  ensureAuth: function (req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  // if user is authenticated and going to login page then redirected to home page if not authenticated redirected to login page  .
  ensureGuest: function (req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/log");
    }
  },
};
