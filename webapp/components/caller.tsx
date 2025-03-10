import { useState } from "react";

const CallButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callSid, setCallSid] = useState<string | null>(null);

  const handleCall = async () => {
    setLoading(true);
    setError(null);
    setCallSid(null);

    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Calls.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`)}`,
        },
        body: new URLSearchParams({
          From: `${process.env.TWILIO_NUMBER}`,
          To: "+59897016149",
          Url: "https://df71-167-58-156-95.ngrok-free.app/twiml",
        }).toString(),
      });

      const data = await response.json();
      if (response.ok) {
        setCallSid(data.sid);
      } else {
        setError("Error al iniciar la llamada");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCall} disabled={loading}>
        {loading ? "Llamando..." : "Iniciar Llamada"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {callSid && <p>Llamada iniciada, SID: {callSid}</p>}
    </div>
  );
};

export default CallButton;
