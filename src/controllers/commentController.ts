import express, { NextFunction, Request, Response, request } from "express";
import { comment } from "../models/index";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/responseUtlis";
import { validateComment } from "../../validation/validation";
import { decodeToken } from "../../utils/jwt";
export async function insert(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;
    const decoded = decodeToken(res, token);
    let { mid, cid } = req.body;
    let { comments }: any = validateComment.parse(req.body);
    if (cid == null) {
      let data: any = {
        movie_id: mid,
        uid: decoded.uid,
        comment: comments,
        parent_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const result = await comment.insert(data);
      sendResponse(res, StatusCodes.OK, {
        message: "The comment was added successfully",
      });
    } else {
      let data: any = {
        movie_id: mid,
        uid: decoded.uid,
        comment: comments,
        parent_id: cid,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const result = await comment.insert(data);
      sendResponse(res, StatusCodes.OK, {
        message: "Reply comment was added successfully",
      });
    }
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
    console.log(comments);
    sendResponse(res, StatusCodes.OK, { comments: comments });
  }
}
