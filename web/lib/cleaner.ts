export function cleanTransactionText(rawText: string): string {
    // Basic garbage filter for clearly non-transactional short lines
    const isGarbageLine = (line: string) => {
        const patterns = [
            /^Page \d+ of \d+/i,
            /System generated statement/i,
            /For any queries, contact us/i,
            /https:\/\/support\.phonepe\.com/i,
            /^Date\s+Type\s+Amount/i
        ];
        // Only skip if it's a short line AND matches a pattern (to avoid skipping long data rows containing these words)
        return line.length < 100 && patterns.some(p => p.test(line));
    };

    // Split by newlines or multiple spaces (handles different PDF export styles)
    const lines = rawText.split(/\n|\s{3,}/);
    const cleanedLines: string[] = [];

    // Robust date detection for PhonePe (e.g., Jun 05, 2025 or 05 Jun 2025)
    const dateRegex = /[A-Z][a-z]{2}\s+\d{1,2},?\s+\d{4}/;

    let currentTransaction = "";

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (isGarbageLine(trimmed)) continue;

        // If line contains a date, it's likely a new transaction start
        if (dateRegex.test(trimmed)) {
            if (currentTransaction) {
                cleanedLines.push(currentTransaction);
            }
            currentTransaction = trimmed;
        } else {
            if (currentTransaction) {
                currentTransaction += " " + trimmed;
            } else {
                // Buffer header info before first date
                currentTransaction = trimmed;
            }
        }
    }

    if (currentTransaction) {
        cleanedLines.push(currentTransaction);
    }

    // If final result is empty, just return the original trimmed text to let the AI try its best
    // rather than throwing a hard error.
    const finalResult = cleanedLines.join("\n").trim();
    return finalResult || rawText.trim().slice(0, 5000);
}
