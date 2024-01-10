import express, { NextFunction, Request, Response, request } from "express";
import { reaction } from "../models/index";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";
import { decodeToken } from "../../utils/jwt";

export async function insert(req: Request, res: Response) {
  let { type } = req.body;
  const token = req.cookies.token;
  const decoded = decodeToken(res, token);
  let { mid } = req.body;
  let data: any = {
    mid: parseInt(mid),
    uid: decoded.uid,
    reaction: type,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const result = await reaction.insert(data);
  if (result) {
    sendResponse(res, StatusCodes.OK, {
      message: `${mid} ${type} by ${decoded.uid}`,
    });
  }
}
export async function fetch(req: Request, res: Response) {
  const { mid } = req.params;
  const result = await reaction.fetch(mid);
  sendResponse(res, StatusCodes.OK, { reactions: result });
}
