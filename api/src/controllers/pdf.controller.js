const { buildInformePdf } = require("../services/pdf.service");

async function generarInformePdf(req, res) {
  try {
    const { nombre, empresa, titulo, descripcion, fecha } = req.body;

    if (!nombre || !titulo) {
      return res.status(400).json({
        ok: false,
        message: "Los campos nombre y titulo son obligatorios"
      });
    }

    const pdfBytes = await buildInformePdf({
      nombre,
      empresa,
      titulo,
      descripcion,
      fecha
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="informe.pdf"');

    return res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error generando PDF:", error);

    return res.status(500).json({
      ok: false,
      message: "Error interno al generar el PDF"
    });
  }
}

module.exports = {
  generarInformePdf
};