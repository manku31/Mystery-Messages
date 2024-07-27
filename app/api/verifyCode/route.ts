import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  // connect database
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodeUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username: decodeUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    /*  If code is valid and not expired
     *  - set isVerified to true for user
     *  Else
     *  - Check code is expired
     *  - Check code is not valid
     */
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "user verified successfully",
        },
        { status: 200 }
      );
    } else {
      if (!isCodeNotExpired) {
        return Response.json(
          {
            success: false,
            message:
              "Verification code expired, please Signup again to get the code",
          },
          { status: 400 }
        );
      } else {
        return Response.json(
          {
            success: false,
            message: "Invalid verification code",
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("Error in verifying user, Error : ", error);
    return Response.json(
      {
        success: false,
        message: "fail to verifed",
      },
      { status: 500 }
    );
  }
}
