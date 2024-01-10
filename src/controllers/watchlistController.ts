import express, { NextFunction, Request, Response, request } from "express";
import { watchList, movies } from "../models/index";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";
import { validateString } from "../../validation/validation";
import { decodeToken } from "../../utils/jwt";
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let { name }: any = await validateString.parse(req.body);
    // if (!name) {
    //   sendResponse(res, StatusCodes.BAD_REQUEST, {
    //     message: "List name required",
    //   });
    // }
    const token = req.cookies.token;
    const decoded = decodeToken(res, token);
    const nameList = await watchList.access(decoded.uid);

    if (nameList.name === name) {
      sendResponse(res, StatusCodes.CONFLICT, {
        message: `This list already exists!`,
      });
    } else {
      let data: any = {
        name: name,
        uid: decoded.uid,
      };
      const result = await watchList.insert(data);
      // if (!result) {
      //   return res.status(400).send({ message: "errror while creating list" });
      // }
      sendResponse(res, StatusCodes.OK, {
        Message: "Successfully created list.",
      });
    }
  } catch (error) {
    next(error);
  }
};
export const fetch = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const decoded = decodeToken(res, token);
  const userList = await watchList.access(decoded.uid);
  if (userList) {
    sendResponse(res, StatusCodes.OK, { WatchList: userList });
  } else {
    sendResponse(res, StatusCodes.NOT_FOUND, { message: "No List Found" });
  }
};
export const insert = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const decoded = decodeToken(res, token);
  const { mid, id } = req.body;
  const midCheck = await movies.checkMid(mid);
  if (!midCheck) {
    sendResponse(res, StatusCodes.NOT_FOUND, {
      message: "Movie id is not there in database",
    });
  }
  const result = await watchList.insertMovies(decoded.uid, mid, id);
  if (result.numAffectedRows) {
    sendResponse(res, StatusCodes.OK, {
      message: `${mid} added to your WatchList`,
    });
  }
  if (!result.numAffectedRows) {
    sendResponse(res, StatusCodes.CONFLICT, {
      message: `${mid} already in your WatchList`,
    });
  }
};
export const getMovies = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const decoded = decodeToken(res, token);
  const { id } = req.params;
  const watchId: any = await watchList.getMid(decoded.uid, id);
  if (!watchId) {
    return sendResponse(res, StatusCodes.NOT_FOUND, {
      message: `The list with the given ID does not exist for your account!`,
    });
  }
  if (watchId.mid === null) {
    sendResponse(res, StatusCodes.NOT_FOUND, {
      message: "List Doesnt have any Movies Please Add Movies",
    });
  }
  const moviesArr: any[] = [];

  let arr = JSON.parse(watchId.mid);
  const moviePromises = arr.map(async (i: any) => {
    const movie = await movies.getMovie(i);
    return movie;
  });
  moviesArr.push(...(await Promise.all(moviePromises)));
  sendResponse(res, StatusCodes.OK, { WatchListMovies: moviesArr });
};
export const removeMovie = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const decoded = decodeToken(res, token);
  const { id } = req.params;
  const { mid } = req.params;
  const deleteFav = await watchList.removeMovie(mid, decoded.uid, id);
  sendResponse(res, StatusCodes.OK, {
    message: "Deleted from Your Watch list",
  });
};
export const share = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: any = await watchList.share(id);
  if (!data) {
    sendResponse(res, StatusCodes.NOT_FOUND, {
      message: "No Watch List Found",
    });
  }
  let movieArr: any[] = [];
  let arr = JSON.parse(data.mid);
  if (arr === null) {
    sendResponse(res, StatusCodes.NOT_FOUND, {
      message: "No Movies are there is Watch List",
    });
  }
  const moviePromises = arr.map(async (i: any) => {
    const movie = await movies.getMovie(i);
    return movie;
  });
  movieArr.push(...(await Promise.all(moviePromises)));
  sendResponse(res, StatusCodes.ACCEPTED, {
    WatchListName: data.name,
    Owner: data.email,
    WatchListMovies: movieArr,
  });
};
export async function update(req: Request, res: Response) {
  const token = req.cookies.token;
  const decoded = decodeToken(res, token);
  const { id } = req.params;
  const { name } = req.body;
  const result = await watchList.update(decoded.uid, id, name);
  if (!result) {
    sendResponse(res, StatusCodes.CONFLICT, {
      message: "Failed to Update the Name",
    });
  } else {
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: "Updated Successfully!",
    });
  }
}
export async function remove(req: Request, res: Response) {
  const token = req.cookies.token;
  const decoded = decodeToken(res, token);
  const { id } = req.params;

  const result = await watchList.remove(decoded.uid, id);

  if (result.length > 0 && result[0].numDeletedRows > 0) {
    // Deletion successful
    sendResponse(res, StatusCodes.OK, {
      message: "Delete Successfully!",
    });
  } else {
    // Deletion failed
    sendResponse(res, StatusCodes.CONFLICT, {
      message: "Failed to Delete the Item",
    });
  }
}
