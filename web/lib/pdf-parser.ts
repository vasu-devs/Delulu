export async function extractTextFromPDF(file: File): Promise<string> {
    // Dynamic import to prevent SSR errors
    const pdfjs = await import("pdfjs-dist");

    // Set worker source using unpkg which mirrors the npm package exactly.
    // Version 5+ handles ESM workers better via unpkg.
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    // Limit to first 4 pages to prevent context overflow, as per requirements
    const pagesToParse = Math.min(pdf.numPages, 4);

    for (let i = 1; i <= pagesToParse; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");

        fullText += pageText + "\n";
    }

    console.log("RAW PDF TEXT:", fullText);
    return fullText;
}
