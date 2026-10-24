from pydantic import BaseModel


class SimulationRequest(BaseModel):
    velocidade_bola: float
    alvo_x: float
    alvo_y: float
    tempo_reacao: float
    altura_goleiro: float


class SimulationResponse(BaseModel):
    tempo_bola: float
    tempo_movimento_goleiro: float
    deslocamento_goleiro: float
    resultado: str
