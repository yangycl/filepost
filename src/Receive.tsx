import { useEffect, useState } from "react";

export function Receive() {
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8000/qr")
      .then((res) => res.text())
      .then((html) => {
        const match = html.match(/src="([^"]+)"/);
        if (match) setQr(match[1]);
      });
  }, []);

  return (
    <div>
      <h2>Receive Mode</h2>
      <p>Show this QR to sender</p>

      {qr && <img src={qr} alt="qr" />}
    </div>
  );
}