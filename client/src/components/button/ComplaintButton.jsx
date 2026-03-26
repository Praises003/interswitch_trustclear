// components/ComplaintButton.jsx

import { getUserId } from "../utils/getUserId";

const ComplaintButton = ({ transactionRef }) => {
  const handleComplaint = async () => {
    const userId = getUserId();

    const res = await fetch("https://interswitch-trustclear-backend.onrender.com/api/v1/complaints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionRef,
        userId,
        reason: "I was debited but not confirmed",
      }),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <button onClick={handleComplaint}>
      Report Issue
    </button>
  );
};

export default ComplaintButton;