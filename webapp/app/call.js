// pages/api/call.js
import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = twilio(accountSid, authToken);

      // Asegurate de definir en tus variables de entorno tu número de Twilio
      const call = await client.calls.create({
        from: process.env.TWILIO_PHONE_NUMBER, // Número de Twilio configurado
        to: "+59897016149", // Número al que deseas llamar
        url: "https://df71-167-58-156-95.ngrok-free.app/twiml", // URL con instrucciones TwiML
      });

      console.log("Llamada iniciada, SID:", call.sid);
      res.status(200).json({ success: true, callSid: call.sid });
    } catch (error) {
      console.error("Error al crear la llamada:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
