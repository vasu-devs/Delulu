# Rupee Roast 🚀

> **"Delulu is not the solulu. Data is."**

Rupee Roast is a powerful, AI-driven financial analysis tool designed to "roast" your spending habits while providing deep, data-backed insights. By leveraging advanced PDF extraction, large language models (Groq/Gemini), and interactive visualizations, Rupee Roast turns your messy bank statements into actionable financial intelligence (and emotional damage).

![Project Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- **📄 Universal PDF Extraction**: Robustly parses complex bank statements (including UPI transactions) using `PyMuPDF4LLM`, ensuring no data is left behind.
- **🤖 AI Financial Roaster**: A distinct "Indian Dad / Gen-Z" persona (powered by Groq/Llama-3) that analyzes your spending and roasts you for impulsive purchases.
- **📊 Interactive Dashboard**: Beautiful, responsive charts (Recharts, Plotly) to visualize category breakdowns, monthly trends, and "impulsive vs. necessary" spending.
- **⚡ Modern Tech Stack**: Built with Next.js 15 (App Router), Tailwind CSS v4, and FastAPI for high performance.
- **🔒 Privacy First**: Local processing pipelines where possible; data is analyzed in-session.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Visualizations**: Recharts, Plotly.js
- **Icons**: Lucide React

### Backend
- **API**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python 3.10+
- **PDF Processing**: PyMuPDF4LLM, PyPDF
- **AI/LLM**: Groq SDK (Llama 3), Google Generative AI (Gemini)
- **Validation**: Pydantic

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Git**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/vasu-devs/Finanjo.git
    cd Finanjo
    ```

2.  **Environment Setup**
    Create a `.env` file in the **root** execution directory (or `server/`) based on the example.
    ```bash
    cp .env.example .env
    ```
    *Required Variables:*
    - `GROQ_API_KEY`: API key for Groq Cloud.
    - `GEMINI_API_KEY`: API key for Google Gemini.

3.  **Run the "Delulu" Script**
    We have a unified startup script that installs dependencies and launches both the backend and frontend services.

    ```bash
    python run_delulu.py
    ```

    *This script will:*
    - Install Python dependencies from `server/requirements.txt`
    - Install Node dependencies from `web/package.json`
    - Start the FastAPI backend on `http://localhost:8000`
    - Start the Next.js frontend on `http://localhost:3000`

### Manual Setup (Optional)

If you prefer running services individually:

**Backend:**
```bash
cd server
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

**Frontend:**
```bash
cd web
npm install
npm run dev
```

## 📂 Project Structure

```
Finanjo/
├── run_delulu.py       # Unified startup script
├── server/             # FastAPI Backend
│   ├── main.py         # API Entry point
│   ├── verify_backend.py # Diagnostic tools
│   └── requirements.txt
└── web/                # Next.js Frontend
    ├── app/            # App Router pages
    ├── components/     # React components
    └── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Made with ❤️ by [Vasudev Siddh](https://github.com/vasu-devs)
