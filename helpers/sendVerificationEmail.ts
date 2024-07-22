import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

type SendVerificationEmailProps = {
  email: string;
  username: string;
  verifyCode: string;
};

export async function sendVerificationEmail({
  email,
  username,
  verifyCode,
}: SendVerificationEmailProps): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Verfication Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verfication email send successfully" };
  } catch (emailError) {
    console.error("Error in sending verfication email", emailError);
    return { success: false, message: "fail to send verification email" };
  }
}
