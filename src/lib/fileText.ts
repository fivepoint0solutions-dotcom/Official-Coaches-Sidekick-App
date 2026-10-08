/* Reads a file in the browser and returns its text: PDF (selectable text, or OCR for scans), photo (OCR),
   Word (.docx), plain text, Markdown, HTML. Nothing is uploaded anywhere. The OCR engine and language
   data are fetched from a public CDN the first time a scan or photo is read. */

const MAX_CHARS = 60000;

export type ReadProgress = { ocr: true; page: number; total: number };

async function inflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** A .docx is a zip; the text lives in word/document.xml. */
async function readDocx(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 66000); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("bad zip");
  const count = view.getUint16(eocd + 10, true);
  let p = view.getUint32(eocd + 16, true);
  for (let n = 0; n < count; n++) {
    if (view.getUint32(p, true) !== 0x02014b50) break;
    const method = view.getUint16(p + 10, true);
    const size = view.getUint32(p + 20, true);
    const nameLen = view.getUint16(p + 28, true);
    const extraLen = view.getUint16(p + 30, true);
    const commentLen = view.getUint16(p + 32, true);
    const local = view.getUint32(p + 42, true);
    const name = new TextDecoder().decode(bytes.subarray(p + 46, p + 46 + nameLen));
    if (name === "word/document.xml") {
      const lNameLen = view.getUint16(local + 26, true);
      const lExtraLen = view.getUint16(local + 28, true);
      const start = local + 30 + lNameLen + lExtraLen;
      const data = bytes.subarray(start, start + size);
      const xml = new TextDecoder().decode(method === 0 ? data : await inflateRaw(data));
      return xml
        .replace(/<w:tab\/>/g, "\t")
        .replace(/<\/w:p>/g, "\n")
        .replace(/<w:br\/>/g, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, "&");
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error("no document.xml");
}

async function ocr(sources: Array<() => Promise<Blob | HTMLCanvasElement>>, onProgress?: (p: ReadProgress) => void) {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(["eng"]);
  try {
    let out = "";
    for (let i = 0; i < sources.length; i++) {
      onProgress?.({ ocr: true, page: i + 1, total: sources.length });
      const make = sources[i];
      if (!make) continue;
      const { data } = await worker.recognize(await make());
      out += (data.text || "") + "\n\n";
      if (out.length >= MAX_CHARS) break;
    }
    return out;
  } finally {
    await worker.terminate();
  }
}

async function readPdf(file: File, onProgress?: (p: ReadProgress) => void): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.min.mjs");
  const worker = (await import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url")).default as string;
  pdfjs.GlobalWorkerOptions.workerSrc = worker;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  let out = "";
  for (let i = 1; i <= Math.min(doc.numPages, 40) && out.length < MAX_CHARS; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    for (const item of content.items) {
      if (!("str" in item)) continue;
      line += item.str + (item.hasEOL ? "\n" : " ");
    }
    out += line + "\n\n";
  }
  if (out.replace(/\s/g, "").length >= 30) return out;
  // No selectable text: it is a scan. Draw each page and read it with OCR.
  const pages = Math.min(doc.numPages, 12);
  const render = (n: number) => async () => {
    const page = await doc.getPage(n);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d")!, viewport, canvas }).promise;
    return canvas;
  };
  const scanned = await ocr(Array.from({ length: pages }, (_, i) => render(i + 1)), onProgress);
  if (!scanned.trim()) throw new Error("scanned");
  return scanned;
}

export async function readFileText(file: File, onProgress?: (p: ReadProgress) => void): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".docx")) return readDocx(file);
  if (name.endsWith(".pdf") || file.type === "application/pdf") return readPdf(file, onProgress);
  if (file.type.startsWith("image/") || /\.(png|jpe?g|webp|heic|bmp|gif)$/.test(name)) {
    const text = await ocr([async () => file], onProgress);
    if (!text.trim()) throw new Error("scanned");
    return text;
  }
  const text = await file.text();
  if (/\.(html?|xml)$/.test(name)) return text.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "").replace(/<[^>]+>/g, " ");
  return text;
}
