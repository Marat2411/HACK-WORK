from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI(title="Photo Service", version="1.0.0")

@app.get("/")
def read_root():
    return {"service": "Photo Processing Service", "status": "running"}

@app.post("/api/upload")
async def upload_photo(file: UploadFile = File(...)):
    # Заглушка - в реальности здесь обработка фото
    return JSONResponse(
        status_code=200,
        content={
            "message": "Photo uploaded successfully",
            "filename": file.filename,
            "url": f"https://bucket.example.com/{file.filename}",
            "processed": True
        }
    )

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "photo_processing"}

# Добавьте эту часть для запуска через python app/main.py
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)