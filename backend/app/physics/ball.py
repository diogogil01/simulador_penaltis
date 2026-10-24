import math


GRAVIDADE = 9.81
DISTANCIA_GOL = 11.0
LARGURA_GOL = 7.32
ALTURA_GOL = 2.44


def kmh_para_ms(velocidade_kmh):
    # converte km/h para m/s
    return velocidade_kmh / 3.6


def ponto_dentro_do_gol(alvo_x, alvo_y):
    # verifica os limites do gol
    limite_x = LARGURA_GOL / 2

    if alvo_x < -limite_x or alvo_x > limite_x:
        return False

    if alvo_y < 0 or alvo_y > ALTURA_GOL:
        return False

    return True


def calcular_tempo_bola(velocidade_kmh, alvo_x, alvo_y):
    # converte a velocidade
    velocidade = kmh_para_ms(velocidade_kmh)

    if velocidade <= 0:
        return None

    # monta a equacao para encontrar o tempo
    distancia_quadrada = (
        alvo_x ** 2
        + alvo_y ** 2
        + DISTANCIA_GOL ** 2
    )

    a = 0.25 * GRAVIDADE ** 2
    b = GRAVIDADE * alvo_y - velocidade ** 2
    c = distancia_quadrada

    discriminante = b ** 2 - 4 * a * c

    if discriminante < 0:
        return None

    u1 = (-b - math.sqrt(discriminante)) / (2 * a)
    u2 = (-b + math.sqrt(discriminante)) / (2 * a)

    tempos = []

    if u1 > 0:
        tempos.append(math.sqrt(u1))

    if u2 > 0:
        tempos.append(math.sqrt(u2))

    if len(tempos) == 0:
        return None

    # usa a trajetoria mais direta
    return min(tempos)
