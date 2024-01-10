import express, { NextFunction, Request, Response, request } from "express";
import { chart } from "../models/index";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/responseUtlis";
export const MoviesChart = async (req: Request, res: Response) => {
  const { id }: any = req.query;
  if (id) {
    const data = await chart.GenreChart(id);
    return res.json(data.rows);
  } else {
    const releasedMovies = await chart.MoviesChart();
    sendResponse(res, StatusCodes.OK, { ReleasedMovies: releasedMovies });
  }
};
