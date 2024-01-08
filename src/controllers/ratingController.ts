import express, { NextFunction, Request, Response, request } from "express";
import { ratings } from "../models/index";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";

export async function RatingsMovies(req: Request, res: Response) {
  let { Ratings } = req.body;
  const email = req.cookies.email;
  let { mid } = req.params;
  Ratings.map(async (i: any) => {
    let data: any = {
      mid: parseInt(mid),
      email: email,
      types: i.type,
      rating: i.ratings,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await ratings.insert(data);
  });
  sendResponse(res, StatusCodes.ACCEPTED, {
    message: `${mid} rated by ${email}`,
  });
}
export async function GenreRatings(req: Request, res: Response) {
  const { id } = req.body;
  const result = await ratings.genreRatings(id);
  if (!result) {
    sendResponse(res, StatusCodes.BAD_REQUEST, {
      message: "Genres is invalid",
    });
  } else {
    sendResponse(res, StatusCodes.ACCEPTED, { GenreRating: result.rows });
  }
}
