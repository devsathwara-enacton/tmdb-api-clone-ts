import express, { NextFunction, Request, Response, request } from "express";
import { comment } from "../models/index";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/responseUtlis";
import { validateComment } from "../../validation/validation";
export async function insert(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req.cookies.uid;
    let { mid } = req.params;
    let { comments }: any = validateComment.parse(req.body);
    let data: any = {
      movie_id: mid,
      uid: uid,
      comment: comments,
      parent_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await comment.insert(data);
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: "The comment was added successfully",
    });
  } catch (error) {
    next(error);
  }
}
export async function insertReply(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const uid = req.cookies.uid;
    let { mid, cid } = req.params;
    let { comments }: any = validateComment.parse(req.body);
    let data: any = {
      movie_id: mid,
      uid: uid,
      comment: comments,
      parent_id: cid,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await comment.insert(data);
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: "Reply  comment was added successfully",
    });
  } catch (error) {
    next(error);
  }
}
export async function fetch(req: Request, res: Response) {
  const { mid } = req.params;
  const comments = await comment.fetch(mid);
  if (!comments || !Array.isArray(comments)) {
    sendResponse(res, StatusCodes.NOT_FOUND, {
      message: "No Comments Found",
    });
  } else {
    sendResponse(res, StatusCodes.OK, comments);
  }
}
