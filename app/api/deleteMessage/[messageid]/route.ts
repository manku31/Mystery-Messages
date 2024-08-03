import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;

  // connect database
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const user: User = session?.user as User;

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or alreday deleted",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message delete successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleting message, Error : ", error);

    return Response.json(
      {
        success: false,
        message: "Error in Deleting message",
      },
      { status: 500 }
    );
  }
}
