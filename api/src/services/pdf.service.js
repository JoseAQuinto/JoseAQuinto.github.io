const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

async function buildInformePdf(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();

  let y = height - 60;

  page.drawText("Informe generado desde el portfolio", {
    x: 50,
    y,
    size: 20,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  y -= 40;

  page.drawText(`Nombre: ${data.nombre || "-"}`, {
    x: 50,
    y,
    size: 12,
    font
  });

  y -= 22;

  page.drawText(`Empresa: ${data.empresa || "-"}`, {
    x: 50,
    y,
    size: 12,
    font
  });

  y -= 22;

  page.drawText(`Título: ${data.titulo || "-"}`, {
    x: 50,
    y,
    size: 12,
    font
  });

  y -= 22;

  page.drawText(`Fecha: ${data.fecha || "-"}`, {
    x: 50,
    y,
    size: 12,
    font
  });

  y -= 36;

  page.drawText("Descripción:", {
    x: 50,
    y,
    size: 13,
    font: fontBold
  });

  y -= 22;

  const descripcion = data.descripcion || "-";

  page.drawText(descripcion, {
    x: 50,
    y,
    size: 12,
    font,
    maxWidth: width - 100,
    lineHeight: 16
  });

  return await pdfDoc.save();
}

module.exports = {
  buildInformePdf
};