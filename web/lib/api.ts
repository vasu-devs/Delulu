/**
 * API Client - supports both file and text
 */

const API_BASE = "/api/v1";

export async function analyzeStatementAPI(input: string | File) {
    const formData = new FormData();

    if (input instanceof File) {
        formData.append("file", input);
    } else {
        formData.append("text", input);
    }

    const response = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: "Unknown backend error" }));
        throw new Error(err.detail || "Backend analysis failed");
    }

    return await response.json();
}
