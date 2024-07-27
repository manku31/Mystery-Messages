import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  // connect the DB
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    //-------------------- User Alrady exist by username and verifie -------------------------//
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username is  alredy taken",
        },
        { status: 400 }
      );
    }
    //---------------------------------------------------------------------------------------//

    //--------------- if User Alrady exist by email or create new user ----------------------//
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    /*  If user alredy existed  by email
     *  - Check user is verified
     *  - else verify the existing user
     *  Else create new user
     */
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User alreday exist with this email ",
          },
          { status: 400 }
        );
      } else {
        const hasedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hasedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      // Creating new user
      const hasedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptmessage: true,
        messages: [],
      });

      await newUser.save();
    }
    //---------------------------------------------------------------------------------------//

    //------------------------ sending verfication email -----------------------------------//
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    console.log("emailResponse : ", emailResponse);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User register successfuly. Please verify your email",
      },
      { status: 201 }
    );
    //---------------------------------------------------------------------------------------//
  } catch (error) {
    console.error("Error in registering user", error);

    return Response.json(
      {
        success: false,
        message: "Error in registering user",
      },
      { status: 500 }
    );
  }
}
