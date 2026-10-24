import type {
  DadosSimulacao,
  ResultadoSimulacao
} from "../types/simulation"

const API_URL = "http://localhost:8000"

export async function simularPenalti(
  dados: DadosSimulacao
): Promise<ResultadoSimulacao> {
  // envia os dados para o backend
  const resposta = await fetch(`${API_URL}/simulacoes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  })

  if (!resposta.ok) {
    throw new Error("erro ao realizar a simulacao")
  }

  return resposta.json()
}
