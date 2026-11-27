from fastapi import APIRouter, HTTPException

from app.database import salvar_simulacao, listar_simulacoes

from app.schemas.simulation_schema import SimulationRequest, SimulationResponse

from app.physics.ball import calcular_tempo_bola, ponto_dentro_do_gol

from app.physics.goalkeeper import calcular_movimento_goleiro, verificar_defesa

router = APIRouter()


# ==========================================
# 1. REALIZAR SIMULACAO
# ==========================================


@router.post("/simulacoes", response_model=SimulationResponse)
def simular(dados: SimulationRequest):

    # Verifica se o ponto esta dentro do gol
    if not ponto_dentro_do_gol(dados.alvo_x, dados.alvo_y):
        raise HTTPException(
            status_code=400, detail="o ponto informado esta fora do gol"
        )

    # Calcula o tempo da bola ate o gol
    tempo_bola = calcular_tempo_bola(dados.velocidade_bola, dados.alvo_x, dados.alvo_y)

    if tempo_bola is None:
        raise HTTPException(
            status_code=400, detail="nao foi possivel calcular a trajetoria"
        )

    # Calcula o movimento possivel do goleiro
    tempo_movimento, deslocamento = calcular_movimento_goleiro(
        tempo_bola, dados.tempo_reacao
    )

    # Verifica se o goleiro consegue defender
    defesa = verificar_defesa(
        dados.alvo_x, dados.alvo_y, deslocamento, dados.altura_goleiro
    )

    # Determina o resultado
    resultado = "DEFESA" if defesa else "GOL"

    # Monta a resposta da simulacao
    resposta = SimulationResponse(
        tempo_bola=tempo_bola,
        tempo_movimento_goleiro=tempo_movimento,
        deslocamento_goleiro=deslocamento,
        resultado=resultado,
    )

    # Salva a simulacao no banco SQLite
    salvar_simulacao(dados, resposta)

    # Retorna o resultado para o frontend
    return resposta


# ==========================================
# 2. CONSULTAR HISTORICO
# ==========================================


@router.get("/simulacoes")
def consultar_historico():

    # Busca os registros salvos no SQLite
    historico = listar_simulacoes()

    # Retorna os registros em formato JSON
    return historico
