//webapp/app/api/twilio/call/[callSid]/route.ts
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
    // Actualizar la llamada a status completed (colgarla)
    const call = await twilioClient
      .calls(callSid)
      .update({ status: "completed" });

    return Response.json({ message: "Call ended successfully", callSid: call.sid });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}