VELOCIDADE_GOLEIRO = 5.0


def calcular_movimento_goleiro(
    tempo_bola,
    tempo_reacao
):
    # calcula o tempo que sobra depois da reacao
    tempo_movimento = tempo_bola - tempo_reacao

    if tempo_movimento < 0:
        tempo_movimento = 0

    # usa uma velocidade fixa nesta versao
    deslocamento = VELOCIDADE_GOLEIRO * tempo_movimento

    return tempo_movimento, deslocamento


def verificar_defesa(
    alvo_x,
    alvo_y,
    deslocamento_goleiro,
    altura_goleiro
):
    # verifica se o goleiro chega na posicao horizontal
    distancia_horizontal = abs(alvo_x)

    chega_horizontal = (
        deslocamento_goleiro >= distancia_horizontal
    )

    # nesta versao a altura do goleiro representa o limite vertical
    chega_vertical = alvo_y <= altura_goleiro

    # a defesa acontece somente se os dois limites forem atendidos
    return chega_horizontal and chega_vertical
