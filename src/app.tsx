import { useState } from "react";
import { Send } from "./Send";
import { Receive } from "./Receive";

export default function App() {
  const [mode, setMode] = useState<"send" | "receive" | null>(null);

  if (!mode) {
    return (
      <div>
        <button onClick={() => setMode("send")}>Send</button>
        <button onClick={() => setMode("receive")}>Receive</button>
      </div>
    );
  }

  return mode === "send" ? <Send /> : <Receive />;
}