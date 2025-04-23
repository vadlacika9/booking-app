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
  const styles = `
    font-family: Arial, sans-serif;
    color: #333;
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border: 1px solid #eaeaea;
    border-radius: 8px;
    background-color: #ffffff;
  `;
  const linkStyle = "color: #1a73e8; text-decoration: none;";

  switch (type) {
    case "VERIFY":
      return {
        subject: "Confirm Your Email Address",
        html: `
          <div style="${styles}">
            <h2>Hello,</h2>
            <p>Thank you for signing up! Please confirm your email address by clicking the link below:</p>
            <p><a href="${baseUrl}/verifyemail?token=${hashedToken}" style="${linkStyle}">Verify Email</a></p>
            <p>If you did not sign up, you can safely ignore this message.</p>
            <br/>
            <p>Best regards,<br/>The Team</p>
          </div>
        `
      };

    case "RESET":
      return {
        subject: "Password Reset Request",
        html: `
          <div style="${styles}">
            <h2>Hello,</h2>
            <p>We received a request to reset your password. To proceed, please click the link below:</p>
            <p><a href="${baseUrl}/resetpassword?token=${hashedToken}" style="${linkStyle}">Reset Password</a></p>
            <p>If you did not request this, you can safely disregard this message.</p>
            <br/>
            <p>Kind regards,<br/>Customer Support Team</p>
          </div>
        `
      };

    case "SERVICE":
      return {
        subject: "Your Service Has Been Successfully Added!",
        html: `
          <div style="${styles}">
            <h2>Hello Service Provider,</h2>
            <p>We’re pleased to inform you that your service has been successfully added to our platform.</p>
            <p>It is now visible to users and ready to receive bookings.</p>
            <p>Thank you for choosing our platform!</p>
            <br/>
            <p>Sincerely,<br/>The Team</p>
          </div>
        `
      };

    case "BOOKING":
      return {
        subject: "Your Booking Has Been Confirmed!",
        html: `
          <div style="${styles}">
            <h2>Hi there,</h2>
            <p>Thank you for your booking! We have successfully received and confirmed your reservation.</p>
            <p>You can view all the details by logging into your account.</p>
            <p>If you have any questions, feel free to reach out to us.</p>
            <br/>
            <p>Best regards,<br/>The Team</p>
          </div>
        `
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