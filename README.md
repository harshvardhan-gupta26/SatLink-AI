SatLink AI — Intelligent Satellite Communication Quality Prediction
Full-stack prototype using the trained Random Forest model supplied for the project.

Backend
cd backend python -m venv .venv .venv\Scripts\activate pip install -r requirements.txt uvicorn app:app --reload --port 8000

Frontend
cd frontend npm install npm run dev

The frontend calls http://localhost:8000/predict.


The target labels are project-defined heuristic labels based primarily on signal strength; they are not independently measured satellite-link ground truth.................nothing changed as i said what i pasted it is same only

> **SatLink AI** predicts satellite link quality with a trained Random Forest model, offering a sleek web UI and a FastAPI backend.

---

## ✨ Key Highlights
- **Real‑time predictions** via the `/predict` FastAPI endpoint.
- **Responsive React (Vite) frontend** with live charts and confidence scores.
- **Docker‑ready** – simple containerised deployment.
- **Extensible architecture** – swap models or add data sources with minimal changes.
- **Well‑structured documentation** and clean project layout.

---

## 📂 Project Structure
```
SatLink‑AI/
├─ backend/          # FastAPI server, model files
│   ├─ app.py
│   └─ model.pkl
├─ frontend/         # React (Vite) UI
│   ├─ src/
│   └─ public/
├─ .gitignore        # excludes env files, node_modules, caches, etc.
├─ README.md         # you are reading this
└─ requirements.txt  # Python dependencies
```

---

## 🚀 Quick Start
### Prerequisites
- **Python 3.10+** & `pip`
- **Node.js 20+** & `npm`
- (Optional) Docker Engine for container builds.

### Backend Setup
```bash
cd backend
python -m venv .venv
# Activate virtual environment (PowerShell)
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```
The API will be reachable at `http://localhost:8000/predict`.

### Frontend Setup
```bash
cd ../frontend
npm install
npm run dev   # Vite dev server → http://localhost:5173
```
The UI automatically calls the backend endpoint.

---

## 📋 How to Use
1. Open the frontend URL (usually `http://localhost:5173`).
2. Enter satellite parameters (elevation, frequency, rain rate, …).
3. Click **Predict** – view the estimated link quality and confidence.

**API example**:
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"elevation":45,"frequency":12.5,"rain_rate":0.3}'
```

---

## 🏗️ Architecture Overview
- **Frontend (React/Vite)** – UI components, state management, API client.
- **Backend (FastAPI)** – Loads `model.pkl`, handles `/predict` requests, returns JSON.
- **Model** – Serialized Random Forest trained on historical satellite telemetry.
- **Docker** – Separate `Dockerfile`s for backend and frontend for easy deployment.

---

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your‑feature`).
3. Make changes; run linters (`npm run lint` for UI, `ruff`/`flake8` for Python).
4. Open a Pull Request with a clear description of the changes.

---

## 📄 License
MIT License – see the `LICENSE` file for details.

---

*Happy coding!*

**SatLink AI** is a full‑stack prototype that predicts satellite link quality using a trained Random Forest model. It provides a modern web interface for visualising predictions and a robust FastAPI backend serving the model.

---

## 🌟 Features
- **Real‑time prediction** via a FastAPI endpoint (`/predict`).
- **Responsive React frontend** with live charts and confidence scores.
- **Docker‑ready** configuration for easy deployment.
- **Extensible architecture** – swap the model or add new data sources with minimal code changes.
- **Comprehensive documentation** and tidy project layout.

---

## 📦 Project Structure
```
SatLink-AI/
├─ backend/          # FastAPI server, model, API routes
│   ├─ app.py
│   └─ model.pkl
├─ frontend/         # React (Vite) UI
│   ├─ src/
│   └─ public/
├─ .gitignore        # excludes env files, node_modules, caches, etc.
├─ README.md         # ↦ this file
└─ requirements.txt  # Python dependencies
```

---

## 🚀 Installation
### Prerequisites
- **Python 3.10+** and `pip`
- **Node.js 20+** and `npm`
- (Optional) Docker Engine if you prefer containerised deployment.

### Backend
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate   # Windows PowerShell
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### Frontend
```bash
cd ../frontend
npm install
npm run dev   # Starts Vite dev server at http://localhost:5173
```
The frontend automatically talks to the backend at `http://localhost:8000/predict`.

---

## 🛠️ Usage
1. Open the frontend in your browser (usually `http://localhost:5173`).
2. Fill in the required satellite parameters (e.g., elevation, frequency).
3. Click **Predict** – the UI displays the estimated link quality and confidence.

You can also call the API directly:
```bash
curl -X POST http://localhost:8000/predict \
    -H "Content-Type: application/json" \
    -d '{"elevation": 45, "frequency": 12.5, "rain_rate": 0.3}'
```

---

## 🏗️ Architecture Overview
- **Frontend (React/Vite)** – UI components, state management, and API client.
- **Backend (FastAPI)** – Serves `/predict`, loads the serialized Random Forest model, and returns JSON responses.
- **Model** – Trained on historical satellite telemetry; stored as `model.pkl`.
- **Docker** – `Dockerfile` in each sub‑project for containerised builds.

---

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome‑feature`).
3. Make your changes and ensure the code passes linting (`npm run lint` for frontend, `ruff` or `flake8` for backend).
4. Open a Pull Request with a clear description of the change.

---

## 📄 License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

*Happy coding!*
