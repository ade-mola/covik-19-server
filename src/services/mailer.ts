import { IEmail } from "../interfaces/Email";
import Logger from "../utilities/Logger";

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(email: IEmail) {
    try {
        await sgMail.send(email);
      } catch (error) {
        Logger.error(`Something went wrong while sending email to ${email.to}`, error)
        throw error
      }
}