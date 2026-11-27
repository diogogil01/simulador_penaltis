
import type {
  DadosSimulacao,
  ResultadoSimulacao,
  HistoricoSimulacao
} from "../types/simulation"

const API_URL = "http://localhost:8000"


// Realiza uma nova simulacao
export async function simularPenalti(
  dados: DadosSimulacao
): Promise<ResultadoSimulacao> {

  const resposta = await fetch(`${API_URL}/simulacoes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  })

  if (!resposta.ok) {
    throw new Error("Erro ao realizar a simulacao")
  }

  return resposta.json()
}


// Busca as ultimas 50 simulacoes
export async function buscarHistorico():
  Promise<HistoricoSimulacao[]> {

  const resposta = await fetch(`${API_URL}/simulacoes`)

  if (!resposta.ok) {
    throw new Error("Erro ao consultar o historico")
  }

  return resposta.json()
}
