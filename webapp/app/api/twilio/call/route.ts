//webapp/app/api/twilio/call/route.ts
import twilioClient from "@/lib/twilio";

export async function POST(req: Request) {
  if (!twilioClient) {
    return Response.json(
      { error: "Twilio client not initialized" },
      { status: 500 }
    );
  }

  try {
    const { to, from, url } = await req.json(); // Número destino, número de Twilio, URL con instrucciones TwiML

    const call = await twilioClient.calls.create({
      to, // Número al que llamas
      from, // Tu número de Twilio
      url, // URL con TwiML (instrucciones para la llamada)
    });

    return Response.json({ message: "Call initiated", callSid: call.sid });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
