import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  user: string;
  message: string;
};

const App = () => {
  const [message, setMessage] = useState<ChatMessage[]>([]);
  console.log(message);
  const [input, setinput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const ws = new WebSocket("https://websocket-backend-yt9l.onrender.com");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessage((prev) => [...prev, msg]);
    };

    return () => {
      ws.close();
    };
  }, []);

  if (!username) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f4f8", // light soothing background
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          minWidth: "300px",
        }}
      >
        <h2 style={{ textAlign: "center", margin: 0 }}>Enter your name to join chat</h2>
        <input
          type="text"
          value={input}
          onChange={(e) => setinput(e.target.value)}
          placeholder="Your name"
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          onClick={() => {
            setUsername(input.trim());
            setinput("");
          }}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#4caf50",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Join Chat
        </button>
      </div>
    </div>
  );
}

  return (
   <>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      padding: "16px",
      backgroundColor: "#f9f9f9",
    }}
  >
    <div
      style={{
        display: "flex",
        gap: "8px",
        width: "100%",
        maxWidth: "600px",
      }}
    >
      <input
        value={input}
        onChange={(e) => setinput(e.target.value)}
        type="text"
        placeholder="Enter your message here"
        style={{
          flex: 1,
          padding: "10px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          outline: "none",
        }}
      />
      <button
        onClick={() => {
          if (
            wsRef.current &&
            wsRef.current.readyState === WebSocket.OPEN
          ) {
            wsRef.current.send(
              JSON.stringify({ user: username, message: input })
            );
            setinput("");
          } else {
            console.warn("WebSocket is not open yet.");
          }
        }}
        style={{
          padding: "10px 16px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#4caf50",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  </div>

  <h3 style={{ textAlign: "center", marginTop: "16px" }}>All Chat:</h3>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "0 16px 32px",
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    {message.map((msg, idx) => {
      const isMine = msg.user === username;
      return (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: isMine ? "flex-end" : "flex-start",
          }}
        >
          <div
            style={{
              backgroundColor: isMine ? "#DCF8C6" : "#e5e7eb", // zinc = tailwind's zinc-200
              color: "#000",
              padding: "10px 14px",
              borderRadius: "16px",
              maxWidth: "70%",
              wordBreak: "break-word",
            }}
          >
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        </div>
      );
    })}
  </div>
</>
  );
};

export default App;
