from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.simulation_routes import router

app = FastAPI(
    title="Simulador de Penaltis",
    version="0.1.0"
)

# libera o frontend local para acessar a api
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# adiciona as rotas da simulacao
app.include_router(router)


@app.get("/")
def inicio():
    return {
        "mensagem": "api do simulador de penaltis"
    }
