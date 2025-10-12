Here’s the **complete README** in a single block, fully formatted and ready for copy-pasting:

---

```markdown
# Cease & Desist Classification

This project is a web application that automates the classification of scanned documents into three categories:
- **Cease**: Requests to stop communication.
- **Uncertain**: Requests that require manual review.
- **Irrelevant**: Requests that are not related to "Cease."

The application uses a FastAPI backend for OCR (Optical Character Recognition) and text classification, and a React frontend for the user interface.

---

## Features

- Upload scanned PDFs or image files (e.g., `.jpg`, `.png`).
- Extract text from uploaded documents using OCR.
- Classify the extracted text into **Cease**, **Uncertain**, or **Irrelevant** categories.
- Display the extracted text and classification result on the UI.
- Handle OCR errors and variations in text for robust classification.

---

## Tech Stack

### Backend
- **FastAPI**: For handling file uploads and classification logic.
- **pytesseract**: For OCR (text extraction from images).
- **pdf2image**: For converting PDF pages to images.
- **Python**: Core programming language.

### Frontend
- **React**: For building the user interface.
- **Material-UI**: For styling and responsive design.
- **Axios**: For making HTTP requests to the backend.

---

## Getting Started

### Prerequisites

- **Node.js**: Install from [https://nodejs.org/](https://nodejs.org/).
- **Python 3.11**: Install from [https://www.python.org/](https://www.python.org/).
- **Tesseract-OCR**: Install using:
  - macOS: `brew install tesseract`
  - Ubuntu: `sudo apt-get install tesseract-ocr`
  - Windows: Download from [https://github.com/tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract).

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/cease-desist-classification.git
cd cease-desist-classification
```

### 2. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

Install the required Python packages:
```bash
pip install -r requirements.txt
```

Start the FastAPI server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The backend will be running at [http://localhost:8000](http://localhost:8000).

---

### 3. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd ../frontend
```

Install the required Node.js packages:
```bash
npm install
```

Start the React development server:
```bash
npm start
```

The frontend will be running at [http://localhost:3000](http://localhost:3000).

---

## Usage

1. Open the React app in your browser at [http://localhost:3000](http://localhost:3000).
2. Upload a scanned PDF or image file.
3. View the extracted text and classification result on the UI.

---

## Deployment

### Backend
- Use Docker to containerize the FastAPI backend.
- Deploy to a cloud platform like AWS, Azure, or Google Cloud.

### Frontend
- Build the React app for production:
  ```bash
  npm run build
  ```
- Deploy the `build` folder to a hosting service like Netlify, Vercel, or AWS Amplify.

---

## Project Structure

```
cease-desist-classification/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── ocr.py           # OCR logic
│   │   ├── classifier.py    # Text classification logic
│   │   ├── utils.py         # Utility functions
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.js # File upload and classification UI
│   │   ├── App.js           # Main React component
│   ├── package.json         # Frontend dependencies
│   └── 

README.md

            # React app README
└── 

README.md

                # Project README
```

---

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [Tesseract-OCR](https://github.com/tesseract-ocr/tesseract)
- [Material-UI](https://mui.com/)
```

---

### **What’s Included**
- **Complete Project Overview**: Describes the purpose and functionality of the project.
- **Features**: Highlights the key features of the application.
- **Tech Stack**: Lists the technologies used in the backend and frontend.
- **Setup Instructions**: Provides detailed steps for setting up the backend and frontend.
- **Usage**: Explains how to use the application.
- **Deployment**: Includes instructions for deploying the backend and frontend.
- **Project Structure**: Shows the directory structure of the project.
- **Contributing and License**: Encourages contributions and includes licensing information.
- **Acknowledgments**: Credits the tools and libraries used.