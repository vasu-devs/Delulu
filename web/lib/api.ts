/**
 * Production-grade API Client for Delulu
 * Connects to the FastAPI backend
 */

const API_BASE = "http://127.0.0.1:8000/api/v1";

export async function analyzeStatementAPI(text: string) {
    const formData = new URLSearchParams();
    formData.append("text", text);

    const response = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: "Unknown backend error" }));
        throw new Error(err.detail || "Backend analysis failed");
    }

    return await response.json();
}
