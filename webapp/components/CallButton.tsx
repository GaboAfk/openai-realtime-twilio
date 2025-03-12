import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PhoneCall, PhoneOff } from "lucide-react";

interface CallButtonProps {
  selectedPhoneNumber: string;
  disabled?: boolean;
}

const CallButton: React.FC<CallButtonProps> = ({ 
  selectedPhoneNumber, 
  disabled = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [callSid, setCallSid] = useState<string | null>(null);

  const makeCall = async () => {
    setIsLoading(true);
    let foundPublicUrl = "";
    try {
      const webhookData = await fetch("http://localhost:8081/public-url");
      if (webhookData.ok) {
        const pubData = await webhookData.json();
        foundPublicUrl = pubData?.publicUrl + '/twiml'|| "";
      } else {
        throw new Error("Local server not responding");
      }
      const number_to_call = process.env.NEXT_PUBLIC_NUMBER_TO_CALL;
      
      if (!webhookData) {
        throw new Error('No se encontró una URL de webhook válida');
      }

      const response = await fetch('/api/twilio/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: number_to_call,
          from: selectedPhoneNumber,
          url: foundPublicUrl,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Llamada iniciada:', data);
        setCallSid(data.callSid);
      } else {
        console.error('Error al iniciar la llamada:', data.error);
        alert(`Error al iniciar la llamada: ${data.error}`);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      alert(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const hangUp = async () => {
    if (!callSid) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/twilio/call/${callSid}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log('Llamada finalizada');
        setCallSid(null);
      } else {
        const data = await response.json();
        console.error('Error al finalizar la llamada:', data.error);
      }
    } catch (error) {
      console.error('Error al colgar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      {!callSid ? (
        <Button 
          onClick={makeCall} 
          disabled={disabled || isLoading || !selectedPhoneNumber}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md flex items-center"
        >
          <PhoneCall className="mr-2" size={18} />
          {isLoading ? 'Iniciando llamada...' : 'Realizar llamada'}
        </Button>
      ) : (
        <Button 
          onClick={hangUp} 
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md flex items-center"
        >
          <PhoneOff className="mr-2" size={18} />
          {isLoading ? 'Finalizando...' : 'Colgar llamada'}
        </Button>
      )}
    </div>
  );
};

export default CallButton;