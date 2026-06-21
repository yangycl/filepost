// server/index.ts
import express from "express";
import os from "os";
import QRCode from "qrcode";

const app = express();
const PORT = 8000;

app.use(express.raw({ type: "application/octet-stream", limit: "200mb" }));

function getLocalIP(): string {
  const nets = os.networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

// 收檔
app.post("/upload", (req, res) => {
  const data = req.body as Buffer;
  console.log("收到檔案 bytes:", data.length);
  res.json({ ok: true });
});

// 產 QR code（給 React 或瀏覽器看）
app.get("/qr", async (req, res) => {
  const ip = getLocalIP();
  const url = `http://${ip}:${PORT}/upload`;

  const qr = await QRCode.toDataURL(url);

  res.send(`
    <h2>Scan to Send</h2>
    <img src="${qr}" />
    <p>${url}</p>
  `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});