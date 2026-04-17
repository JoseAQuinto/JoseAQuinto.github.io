const API_URL = import.meta.env.VITE_API_URL;

export type GenerarInformeRequest = {
  nombre: string;
  empresa: string;
  titulo: string;
  descripcion: string;
  fecha: string;
};

export async function generarInforme(
  data: GenerarInformeRequest
): Promise<Blob> {
  const response = await fetch(`${API_URL}/api/pdf/informe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("No se pudo generar el PDF");
  }

  return await response.blob();
}

export function descargarBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}