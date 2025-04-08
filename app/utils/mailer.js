import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
import { PrismaClient } from '@prisma/client';


const db = new PrismaClient();
export const sendEmail = async({email, emailType, userId}) => {
  try{

    //create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if(emailType === "VERIFY"){
      const updatedUser = await db.users.update({
        where: 
        {user_id:Number(userId)},
        data:
        {
          verifiyToken: hashedToken,
          verifiyTokenExpire: new Date(Date.now() + 36000000)
        }
       })
    } else if(emailType === "RESET"){
      const updatedUser = await db.users.update({
        where: 
        {user_id:userId},
        data:
        {
          resetPasswordToken: hashedToken,
          resetPasswordExpire: new Date(Date.now() + 36000000)
        }
       })
    }
  

    // Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
   
  }
});


const getMailContent = (type, hashedToken) => {
  const baseUrl = process.env.DOMAIN;
  switch (type) {
    case "VERIFY":
      return {
        subject: "Verify your email",
        html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to verify your email.</p>`
      };
    case "RESET":
      return {
        subject: "Reset your password",
        html: `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a> to reset your password.</p>`
      };
    case "SERVICE":
      return {
        subject: "Successfully added your service!",
        html: `<p>We're glad to have you. 🎉</p>`
      };
    case "BOOKING":
      return {
        subject: "Successfull Booking!",
        html: `<p>We're glad to have you. 🎉</p>`
      };
    default:
      throw new Error("Unknown email type");
  }
};

const { subject, html } = getMailContent(emailType, hashedToken);

const mailOptions = {
  from: 'kovacsics@gmail.com',
  to: email,
  subject: subject,
  html: html
};


const mailResponse = await transport.sendMail(mailOptions);

return mailResponse;

  }catch(error){
    throw new Error(error.message)
  }
}