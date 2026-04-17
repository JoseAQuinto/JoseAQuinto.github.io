const express = require("express");
const cors = require("cors");
const pdfRoutes = require("./routes/pdf.routes");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "API funcionando" });
});

app.use("/api/pdf", pdfRoutes);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});