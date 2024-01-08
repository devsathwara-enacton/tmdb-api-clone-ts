import express, { NextFunction, Request, Response, request } from "express";
import { watchList, movies } from "../models/index";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";
export const create = async (req: Request, res: Response): Promise<any> => {
  let { name } = req.body;
  if (!name) {
    sendResponse(res, StatusCodes.BAD_REQUEST, {
      message: "List name required",
    });
  }
  const email = req.cookies.email;
  const nameList = await watchList.accessList(email);
  for (let i of nameList) {
    if (i.name === name) {
      sendResponse(res, StatusCodes.CONFLICT, {
        message: `This list already exists!`,
      });
    }
  }

  let data: any = {
    name: name,
    email: email,
  };
  const result = await watchList.insertList(data);
  // if (!result) {
  //   return res.status(400).send({ message: "errror while creating list" });
  // }
  sendResponse(res, StatusCodes.ACCEPTED, {
    Message: "Successfully created list.",
  });
};
export const accessList = async (req: Request, res: Response) => {
  const userEmail = req.cookies.email;
  const userList = await watchList.accessList(userEmail);
  if (userList) {
    sendResponse(res, StatusCodes.ACCEPTED, { FavouriteList: userList });
  } else {
    sendResponse(res, StatusCodes.NOT_FOUND, { message: "No List Found" });
  }
};
export const insert = async (req: Request, res: Response) => {
  const userEmail = req.cookies.email;
  const { mid, id } = req.body;
  const midCheck = await movies.checkMid(mid);
  if (!midCheck) {
    sendResponse(res, StatusCodes.NOT_FOUND, {
      message: "Movie id is not there in database",
    });
  }
  const result = await watchList.insert(userEmail, mid, id);
  if (result.numAffectedRows) {
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: `${mid} added to your WatchList`,
    });
  } else {
    sendResponse(res, StatusCodes.CONFLICT, {
      message: `${mid} already in your WatchList`,
    });
  }
};
export const getMovies = async (req: Request, res: Response) => {
  const { email } = req.cookies;
  const { id } = req.params;
  const favouritesId: any = await watchList.getMid(email, id);
  if (favouritesId.mid === null) {
    sendResponse(res, StatusCodes.NOT_FOUND, {
      message: "List Doesnt have any Movies Please Add Movies",
    });
  }
  const moviesArr: any[] = [];

  let arr = JSON.parse(favouritesId.mid);
  const moviePromises = arr.map(async (i: any) => {
    const movie = await movies.getMovie(i);
    return movie;
  });
  moviesArr.push(...(await Promise.all(moviePromises)));

  if (moviesArr.length == 0) {
    sendResponse(res, StatusCodes.NOT_FOUND, {
      message: "No Movies are there is Watch List",
    });
  }
  sendResponse(res, StatusCodes.ACCEPTED, { WatchListMovies: moviesArr });
};
export const deleteMovies = async (req: Request, res: Response) => {
  const userEmail = req.cookies.email;
  const { id } = req.params;
  const { mid } = req.body;
  const deleteFav = await watchList.deleteMovies(mid, userEmail, id);
  sendResponse(res, StatusCodes.ACCEPTED, {
    message: "Deleted from Your Watch list",
  });
};
export const shareWatchList = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: any = await watchList.shareWatchList(id);
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
  const email = req.cookies.email;
  const { id } = req.params;
  const { name } = req.body;
  const result = await watchList.update(email, id, name);
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
export async function deleteWatchList(req: Request, res: Response) {
  const email = req.cookies.email;
  const { id } = req.params;

  const result = await watchList.deleteWatchList(email, id);

  if (result.length > 0 && result[0].numDeletedRows > 0) {
    // Deletion successful
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: "Delete Successfully!",
    });
  } else {
    // Deletion failed
    sendResponse(res, StatusCodes.CONFLICT, {
      message: "Failed to Delete the Item",
    });
  }
}
