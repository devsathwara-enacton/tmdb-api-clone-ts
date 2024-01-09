import express, { NextFunction, Request, Response, request } from "express";
import { reaction } from "../models/index";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";

export async function insert(req: Request, res: Response) {
  let { type } = req.body;
  const uid = req.cookies.uid;
  let { mid } = req.params;
  let data: any = {
    mid: parseInt(mid),
    uid: uid,
    reaction: type,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const result = await reaction.insert(data);
  if (result) {
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: `${mid} ${type} by ${uid}`,
    });
  }
}
export async function fetch(req: Request, res: Response) {
  const { mid } = req.params;
  const result = await reaction.fetch(mid);
  sendResponse(res, StatusCodes.OK, { reactions: result });
}
