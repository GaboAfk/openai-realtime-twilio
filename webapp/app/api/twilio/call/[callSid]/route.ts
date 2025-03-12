import twilioClient from "@/lib/twilio";

export async function DELETE(
  request: Request,
  { params }: { params: { callSid: string } }
) {
  if (!twilioClient) {
    return Response.json(
      { error: "Twilio client not initialized" },
      { status: 500 }
    );
  }

  const { callSid } = params;

  try {
    const call = await twilioClient
      .calls(callSid)
      .update({ status: "completed" });

    return Response.json({ message: "Call ended successfully", callSid: call.sid });
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }
}