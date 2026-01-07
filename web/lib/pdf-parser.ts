export async function extractTextFromPDF(file: File): Promise<string> {
    // Dynamic import to prevent SSR errors
    const pdfjs = await import("pdfjs-dist");

    // Set worker source using unpkg which mirrors the npm package exactly.
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    // Extract ALL pages - no limit
    console.log(`📄 Extracting ${pdf.numPages} pages...`);

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
            .map((item) => ("str" in item ? (item as { str: string }).str : ""))
            .join(" ");

        fullText += pageText + "\n";
    }

    console.log(`✅ Extracted ${fullText.length} chars from PDF`);
    return fullText;
}

