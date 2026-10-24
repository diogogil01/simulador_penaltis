from fastapi import APIRouter, HTTPException

from app.schemas.simulation_schema import (
    SimulationRequest,
    SimulationResponse
)
from app.physics.ball import (
    calcular_tempo_bola,
    ponto_dentro_do_gol
)
from app.physics.goalkeeper import (
    calcular_movimento_goleiro,
    verificar_defesa
)

router = APIRouter()


@router.post(
    "/simulacoes",
    response_model=SimulationResponse
)
def simular(dados: SimulationRequest):
    # verifica se o ponto esta dentro do gol
    if not ponto_dentro_do_gol(
        dados.alvo_x,
        dados.alvo_y
    ):
        raise HTTPException(
            status_code=400,
            detail="o ponto informado esta fora do gol"
        )

    # calcula o tempo da bola
    tempo_bola = calcular_tempo_bola(
        dados.velocidade_bola,
        dados.alvo_x,
        dados.alvo_y
    )

    if tempo_bola is None:
        raise HTTPException(
            status_code=400,
            detail="nao foi possivel calcular a trajetoria"
        )

    # calcula o movimento do goleiro
    tempo_movimento, deslocamento = (
        calcular_movimento_goleiro(
            tempo_bola,
            dados.tempo_reacao
        )
    )

    # verifica se o goleiro alcanca a bola
    defesa = verificar_defesa(
        dados.alvo_x,
        dados.alvo_y,
        deslocamento,
        dados.altura_goleiro
    )

    resultado = "DEFESA" if defesa else "GOL"

    return SimulationResponse(
        tempo_bola=tempo_bola,
        tempo_movimento_goleiro=tempo_movimento,
        deslocamento_goleiro=deslocamento,
        resultado=resultado
    )
