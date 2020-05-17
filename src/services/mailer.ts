import { IEmail } from "../interfaces/Email";

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(email: IEmail) {
    try {
        await sgMail.send(email);
      } catch (error) {
          //log error and throw forward
        console.error(error);
        throw error
      }
}