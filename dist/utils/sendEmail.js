"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../src/config/config"));
const secret = config_1.default.env.app.secret;
var transport = nodemailer_1.default.createTransport({
    host: config_1.default.env.app.emailHost,
    port: config_1.default.env.app.mailPort,
    auth: {
        user: config_1.default.env.app.emailUser,
        pass: config_1.default.env.app.emailPass,
    },
});
function sendEmail(fromEmail, toEmail, subject, text, link) {
    return __awaiter(this, void 0, void 0, function* () {
        yield transport.sendMail({
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
          ${link
                ? `     <a
          style="text-decoration: none; color: #fff; border-radius: 4px; display: inline-block; background: #00466a; padding: 0 10px;"
          href=${link}
        >
       ${text}
        </a>`
                : text}
       
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
    });
}
exports.sendEmail = sendEmail;
