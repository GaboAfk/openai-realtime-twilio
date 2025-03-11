// webapp/components/CallButton.tsx
import React from 'react';

const CallButton: React.FC = () => {
  const handleCall = async () => {
    try {
      const response = await fetch('/api/twilio/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: process.env.NUMBER_TO_CALL,
          from: process.env.TWILIO_PHONE_NUMBER,
          url: await fetch("http://localhost:8081/public-url"), // Placeholder TwiML URL for testing
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Call initiated:', data);
      } else {
        console.error('Error initiating call:', data.error);
      }
    } catch (error) {
      console.error('Error making the request:', error);
    }
  };

  return (
    <button onClick={handleCall} className="bg-blue-500 text-white px-4 py-2 rounded">
      Make a Call
    </button>
  );
};

export default CallButton;