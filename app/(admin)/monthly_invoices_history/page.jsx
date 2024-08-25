"use client";

import { getUsersEmail } from "@/api/firebase/functions/fetch";
import { checkEmailAndSendMessage } from "@/api/firebase/functions/upload";
import { useEffect, useState } from "react";

export default function Page() {
  const [users, setUsers] = useState({ email: "", index: 0, total: 0 });
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");

  console.log(users);

  const validatePassword = async (inputPassword) => {
    const correctPassword = "Dell@Infinix2465DTS";
    if (inputPassword === correctPassword) {
      setIsAuthorized(true);
      setError("");
    } else {
      setError("Invalid password.");
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      const fetchAndSendEmails = async () => {
        const fetchedUsers = await getUsersEmail();

        for (let i = 0; i < fetchedUsers.length; i++) {
          const email = fetchedUsers[i];
          try {
            await checkEmailAndSendMessage(email);

            setUsers({
              email: email,
              index: i + 1,
              total: fetchedUsers.length,
            });
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay between requests
          } catch (error) {
            console.error(`Failed to send email to ${email}: `, error);
          }
        }
      };
      fetchAndSendEmails();
    }
  }, [isAuthorized]);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "400px",
        margin: "auto",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {!isAuthorized ? (
        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "10px",
              marginBottom: "10px",
              width: "100%",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <button
            onClick={() => validatePassword(password)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
      ) : (
        <div style={{ marginTop: "20px", fontSize: "18px" }}>
          Sending to: {users.email} ({users.index} of {users.total})
        </div>
      )}
    </div>
  );
}
