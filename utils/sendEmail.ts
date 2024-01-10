import nodemailer from "nodemailer";
import config from "../src/config/config";
import jwt from "jsonwebtoken";
import sendResponse from "./responseUtlis";
import { StatusCodes } from "http-status-codes";

const secret = config.env.app.secret;
var transport = nodemailer.createTransport({
  host: config.env.app.emailHost,
  port: config.env.app.mailPort,
  auth: {
    user: config.env.app.emailUser,
    pass: config.env.app.emailPass,
  },
});
export async function sendEmail(
  fromEmail: any,
  toEmail: any,
  subject: any,
  text: any,
  link: any
) {
  await transport.sendMail({
    from: fromEmail,
    to: toEmail,
    subject: subject,
    html: `<!DOCTYPE html>
    <html>
      <body>
        <div
          style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2"
        >
          <div
            style="margin: 50px auto; width: 70%; padding: 20px 0"
          >
            <div
              style="border-bottom: 1px solid #eee"
            >
              <div
                
                style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600"
              >
                TMDB
              </div>
            </div>
            <p style="font-size: 1.1em">Hi,</p>
            <p>
              Thank you for choosing TMDB. Use the following to complete your Sign Up procedures.
            </p>
    
            <h2
            style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;"
          >
          ${
            link
              ? `     <a
          style="text-decoration: none; color: #fff; border-radius: 4px; display: inline-block; background: #00466a; padding: 0 10px;"
          href=${link}
        >
       ${text}
        </a>`
              : text
          }
       
          </h2>
    
            <p style="font-size: 0.9em">
              Regards,<br />TMDB
            </p>
            <hr style="border: none; border-top: 1px solid #eee" />
          </div>
        </div>
      </body>
    </html>
    `,
  });
}
