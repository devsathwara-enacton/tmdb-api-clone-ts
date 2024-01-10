import express, { NextFunction, Request, Response, request } from "express";
import { favorite, movies } from "../models/index";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";
import { decodeToken } from "../../utils/jwt";
export const insert = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const decoded = decodeToken(res, token);
  const { mid } = req.body;
  const midCheck = await movies.checkMid(mid);
  if (!midCheck) {
    sendResponse(res, StatusCodes.BAD_REQUEST, {
      message: "Movie id is not there in database",
    });
  }
  const result = await favorite.insert(decoded.uid, mid);
  if (result.numAffectedRows) {
    sendResponse(res, StatusCodes.OK, {
      message: `${mid} added to your Favorites`,
    });
  } else {
    sendResponse(res, StatusCodes.CONFLICT, {
      message: `${mid} already in your Favorites`,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const decoded = decodeToken(res, token);
  const { mid } = req.body;
  const result: any = await favorite.remove(mid, decoded.uid);
  sendResponse(res, StatusCodes.OK, {
    message: `${mid} deleted from favorites`,
  });
};
export const fetch = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const decoded = decodeToken(res, token);
  const favId = await favorite.check(decoded.uid);
  const moviesArr: any[] = [];
  await Promise.all(
    favId.map(async (i: any) => {
      let arr = JSON.parse(i.favorites);
      const moviePromises = arr.map(async (i: any) => {
        const movie = await movies.getMovie(i);
        return movie;
      });
      moviesArr.push(...(await Promise.all(moviePromises)));
    })
  );
  sendResponse(res, StatusCodes.OK, { FavoritesMovies: moviesArr });
};
