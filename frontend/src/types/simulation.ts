export type DadosSimulacao = {
  velocidade_bola: number
  alvo_x: number
  alvo_y: number
  tempo_reacao: number
  altura_goleiro: number
}

export type ResultadoSimulacao = {
  tempo_bola: number
  tempo_movimento_goleiro: number
  deslocamento_goleiro: number
  resultado: string
}
