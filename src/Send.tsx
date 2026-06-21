import { useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export function Send() {
  const [url, setUrl] = useState<string>("");

  function startScan() {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render((text) => {
      setUrl(text);
      scanner.clear();
    }, () => {});
  }

  async function sendFile(file: File) {
    const CHUNK_SIZE = 64 * 1024;
    const fileId = crypto.randomUUID();
    const total = Math.ceil(file.size / CHUNK_SIZE);

    let index = 0;

    for (let start = 0; start < file.size; start += CHUNK_SIZE) {
      const chunk = file.slice(start, start + CHUNK_SIZE);
      const buffer = await chunk.arrayBuffer();

      await fetch(
        `${url}/chunk?fileId=${fileId}&index=${index}&total=${total}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream"
          },
          body: buffer
        }
      );

      index++;
    }

    alert("傳送完成");
  }

  return (
    <div>
      <h2>Send Mode</h2>

      {!url ? (
        <>
          <button onClick={startScan}>Scan QR</button>
          <div id="reader" style={{ width: 300 }} />
        </>
      ) : (
        <>
          <p>Connected:</p>
          <p>{url}</p>

          <input
            type="file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) sendFile(f);
            }}
          />
        </>
      )}
    </div>
  );
}