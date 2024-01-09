import express, { NextFunction, Request, Response, request } from "express";
import { ratings } from "../models/index";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";

export async function insert(req: Request, res: Response) {
  let { Ratings } = req.body;
  const uid = req.cookies.uid;
  let { mid } = req.params;
  Ratings.map(async (i: any) => {
    let data: any = {
      mid: parseInt(mid),
      uid: uid,
      types: i.type,
      rating: i.ratings,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await ratings.insert(data);
  });
  sendResponse(res, StatusCodes.ACCEPTED, {
    message: `${mid} rated by ${uid}`,
  });
}
export async function fetch(req: Request, res: Response) {
  const { id } = req.params;
  const result = await ratings.fetch(id);
  if (!result) {
    sendResponse(res, StatusCodes.BAD_REQUEST, {
      message: "Genres is invalid",
    });
  } else {
    sendResponse(res, StatusCodes.ACCEPTED, { GenreRating: result.rows });
  }
}
