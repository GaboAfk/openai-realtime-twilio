import twilioClient from "@/lib/twilio";

export async function POST(req: Request) {
  if (!twilioClient) {
    return Response.json(
      { error: "Twilio client not initialized" },
      { status: 500 }
    );
  }

  try {
    const { to, from, url } = await req.json();

    const call = await twilioClient.calls.create({
      to,
      from,
      url,
    });

    return Response.json({ message: "Call initiated", callSid: call.sid });
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }
}
