import User from '@/models/userModels';
import bcryptjs from 'bcryptjs';
import nodemailer  from 'nodemailer';
export const sendEmail = async({email,emailType,userId}:any)=>{
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(),10)

        if(emailType === 'VERIFY'){
            await User.findOneAndUpdate(userId,{
                verifyToken:hashedToken,
                verifyTokenExpiry:Date.now()+3600000
            })
        }else if(emailType === 'RESET'){
            await User.findOneAndUpdate(userId,{
                forgotPasswordToken:hashedToken,
                forgotPasswordTokenExpiry:Date.now()+3600000
            })
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "0ad9afcb493819",
              pass: "ff3aa1b4aba3f4"
            }
          });
        const mailOptions = {
            from:'apupaul@apu.ai',
            to:email,
            subject:emailType==='VERIFY'?"Verify your email" : "Reset your passsword",
            html:`<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">Here</a>To ${emailType === 'VERIFY'?'Verify your email':'Reset your password'} or copy and paste the link in your browser <br />${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`
        }
        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse;
    } catch (error:any) {
        throw new Error(error.message)
    }
}
