import express, { NextFunction, Request, Response, request } from "express";
import { favourite, movies } from "../models/index";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";
export const insert = async (req: Request, res: Response) => {
  const userEmail = req.cookies.email;
  const { mid } = req.body;
  const midCheck = await movies.checkMid(mid);
  if (!midCheck) {
    sendResponse(res, StatusCodes.BAD_REQUEST, {
      message: "Movie id is not there in database",
    });
  }
  const result = await favourite.insert(userEmail, mid);
  if (result.numAffectedRows) {
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: `${mid} added to your Favorites`,
    });
  } else {
    sendResponse(res, StatusCodes.CONFLICT, {
      message: `${mid} already in your Favorites`,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  const userEmail = req.cookies.email;
  const { mid } = req.body;
  const result: any = await favourite.remove(mid, userEmail);
  sendResponse(res, StatusCodes.ACCEPTED, {
    message: `${mid} deleted from favourites`,
  });
};
export const fetch = async (req: Request, res: Response) => {
  const { email } = req.cookies;
  const favId = await favourite.check(email);
  const moviesArr: any[] = [];
  await Promise.all(
    favId.map(async (i: any) => {
      let arr = JSON.parse(i.favourites);
      const moviePromises = arr.map(async (i: any) => {
        const movie = await movies.getMovie(i);
        return movie;
      });
      moviesArr.push(...(await Promise.all(moviePromises)));
    })
  );
  sendResponse(res, StatusCodes.ACCEPTED, { FavouritesMovies: moviesArr });
};
