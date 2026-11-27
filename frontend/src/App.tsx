
import { useEffect, useState } from "react"
import type { MouseEvent } from "react"

import {
  simularPenalti,
  buscarHistorico
} from "./services/api"

import type {
  ResultadoSimulacao,
  HistoricoSimulacao
} from "./types/simulation"


function App() {
  // Dados do chute
  const [velocidade, setVelocidade] = useState(90)
  const [alvoX, setAlvoX] = useState(2)
  const [alvoY, setAlvoY] = useState(1.5)

  // Dados do goleiro
  const [tempoReacao, setTempoReacao] = useState(0.2)
  const [alturaGoleiro, setAlturaGoleiro] = useState(1.90)

  // Dados da animacao
  const [resultado, setResultado] =
    useState<ResultadoSimulacao | null>(null)

  const [erro, setErro] = useState("")
  const [animando, setAnimando] = useState(false)
  const [bolaNoAlvo, setBolaNoAlvo] = useState(false)
  const [goleiroX, setGoleiroX] = useState(0)
  const [duracaoBola, setDuracaoBola] = useState(1000)
  const [duracaoGoleiro, setDuracaoGoleiro] = useState(500)

  // Historico das simulacoes
  const [historico, setHistorico] =
    useState<HistoricoSimulacao[]>([])

  const [erroHistorico, setErroHistorico] = useState("")


  // Busca o historico ao abrir a pagina
  useEffect(() => {
    buscarHistorico()
      .then(setHistorico)
      .catch(() => {
        setErroHistorico("Nao foi possivel carregar o historico")
      })
  }, [])


  // Atualiza a tabela de historico
  async function atualizarHistorico() {
    try {
      const registros = await buscarHistorico()
      setHistorico(registros)
      setErroHistorico("")
    } catch {
      setErroHistorico("Nao foi possivel atualizar o historico")
    }
  }


  function resetar() {
    setResultado(null)
    setErro("")
    setAnimando(false)
    setBolaNoAlvo(false)
    setGoleiroX(0)
  }


  function escolherAlvo(
    evento: MouseEvent<HTMLDivElement>
  ) {
    if (animando) {
      return
    }

    const gol = evento.currentTarget
    const area = gol.getBoundingClientRect()

    const cliqueX = evento.clientX - area.left
    const cliqueY = evento.clientY - area.top

    // Converte pixels para metros
    let novoX = (cliqueX / area.width) * 7.32 - 3.66
    let novoY = ((area.height - cliqueY) / area.height) * 2.44

    novoX = Math.max(-3.66, Math.min(3.66, novoX))
    novoY = Math.max(0, Math.min(2.44, novoY))

    setAlvoX(Number(novoX.toFixed(2)))
    setAlvoY(Number(novoY.toFixed(2)))

    setResultado(null)
    setErro("")
    setBolaNoAlvo(false)
    setGoleiroX(0)
  }


  async function simular() {
    setErro("")
    setResultado(null)
    setAnimando(true)
    setBolaNoAlvo(false)
    setGoleiroX(0)

    try {
      // Envia os parametros ao backend
      const resposta = await simularPenalti({
        velocidade_bola: velocidade,
        alvo_x: alvoX,
        alvo_y: alvoY,
        tempo_reacao: tempoReacao,
        altura_goleiro: alturaGoleiro
      })

      // Atualiza o historico apos salvar
      void atualizarHistorico()

      // Escala usada somente na animacao visual
      const escalaTempo = 2500

      const tempoVisualBola = Math.max(
        800,
        resposta.tempo_bola * escalaTempo
      )

      const tempoVisualReacao =
        tempoReacao * escalaTempo

      const tempoVisualGoleiro = Math.max(
        200,
        resposta.tempo_movimento_goleiro * escalaTempo
      )

      setDuracaoBola(tempoVisualBola)
      setDuracaoGoleiro(tempoVisualGoleiro)

      // Direcao do movimento do goleiro
      const direcao = alvoX < 0 ? -1 : 1

      const deslocamentoVisual = Math.min(
        Math.abs(alvoX),
        resposta.deslocamento_goleiro
      ) * direcao

      setTimeout(() => {
        setBolaNoAlvo(true)
      }, 50)

      setTimeout(() => {
        setGoleiroX(deslocamentoVisual)
      }, tempoVisualReacao)

      setTimeout(() => {
        setResultado(resposta)
        setAnimando(false)
      }, tempoVisualBola + 80)

    } catch {
      setErro("Nao foi possivel realizar a simulacao")
      setAnimando(false)
    }
  }


  // Posicoes visuais da bola e do goleiro
  const alvoLeft = 50 + (alvoX / 7.32) * 100
  const alvoBottom = (alvoY / 2.44) * 100

  const bolaLeft = bolaNoAlvo ? alvoLeft : 50
  const bolaBottom = bolaNoAlvo ? alvoBottom : 2

  const goleiroLeft = 50 + (goleiroX / 7.32) * 100

  const alturaVisualGoleiro = Math.max(
    85,
    Math.min(145, alturaGoleiro * 63)
  )


  return (
    <div className="pagina">

      <header className="cabecalho">
        <h1>Simulador de Penaltis e Goleiro</h1>
        <p>Simulacao computacional de cobrancas de penalti</p>
      </header>

      <main className="conteudo">

        {/* Painel dos parametros */}
        <section className="painel">
          <h2>Parametros do chute</h2>

          <label>Velocidade da bola (km/h)</label>
          <input
            type="number"
            value={velocidade}
            disabled={animando}
            onChange={(e) =>
              setVelocidade(Number(e.target.value))
            }
          />

          <label>Posicao horizontal X (m)</label>
          <input
            type="number"
            step="0.1"
            value={alvoX}
            disabled={animando}
            onChange={(e) =>
              setAlvoX(Number(e.target.value))
            }
          />

          <label>Altura Y (m)</label>
          <input
            type="number"
            step="0.1"
            value={alvoY}
            disabled={animando}
            onChange={(e) =>
              setAlvoY(Number(e.target.value))
            }
          />

          <p className="dica">
            Voce tambem pode clicar diretamente no gol
            para escolher o alvo.
          </p>

          <h2>Parametros do goleiro</h2>

          <label>Tempo de reacao (s)</label>
          <input
            type="number"
            step="0.01"
            value={tempoReacao}
            disabled={animando}
            onChange={(e) =>
              setTempoReacao(Number(e.target.value))
            }
          />

          <label>Altura do goleiro (m)</label>
          <input
            type="number"
            step="0.01"
            min="1.40"
            max="2.20"
            value={alturaGoleiro}
            disabled={animando}
            onChange={(e) =>
              setAlturaGoleiro(Number(e.target.value))
            }
          />

          <p className="dica">
            A velocidade do goleiro e fixa nesta versao.
          </p>

          <button
            onClick={simular}
            disabled={animando}
          >
            {animando ? "Simulando..." : "Simular"}
          </button>

          <button
            className="botao-secundario"
            onClick={resetar}
            disabled={animando}
          >
            Resetar
          </button>

          {erro && <p className="erro">{erro}</p>}
        </section>


        {/* Visualizacao da simulacao */}
        <section className="area-simulacao">

          <div
            className="gol"
            onClick={escolherAlvo}
          >
            <div className="rede"></div>

            <div
              className="alvo"
              style={{
                left: `${alvoLeft}%`,
                bottom: `${alvoBottom}%`
              }}
            ></div>

            <div
              className="goleiro"
              style={{
                left: `${goleiroLeft}%`,
                height: `${alturaVisualGoleiro}px`,
                transitionDuration: `${duracaoGoleiro}ms`
              }}
            >
              <div className="cabeca"></div>
              <div className="corpo"></div>
              <div className="braco braco-esquerdo"></div>
              <div className="braco braco-direito"></div>
            </div>

            <div
              className="bola"
              style={{
                left: `${bolaLeft}%`,
                bottom: `${bolaBottom}%`,
                transitionDuration: `${duracaoBola}ms`
              }}
            ></div>
          </div>


          {/* Resultado da cobranca */}
          <div className="resultado">

            {animando && (
              <p className="status">
                Simulacao em andamento...
              </p>
            )}

            {!animando && !resultado && (
              <p>Escolha o alvo e clique em Simular.</p>
            )}

            {resultado && (
              <>
                <h2
                  className={
                    resultado.resultado === "GOL"
                      ? "texto-gol"
                      : "texto-defesa"
                  }
                >
                  {resultado.resultado}
                </h2>

                <p>
                  Tempo da bola:{" "}
                  <strong>
                    {resultado.tempo_bola.toFixed(3)} s
                  </strong>
                </p>

                <p>
                  Tempo de movimento do goleiro:{" "}
                  <strong>
                    {resultado.tempo_movimento_goleiro.toFixed(3)} s
                  </strong>
                </p>

                <p>
                  Deslocamento do goleiro:{" "}
                  <strong>
                    {resultado.deslocamento_goleiro.toFixed(2)} m
                  </strong>
                </p>
              </>
            )}
          </div>


          {/* Historico do banco SQLite */}
          <div className="historico">

            <h2>Historico de simulacoes</h2>

            <p className="dica">
              Ultimas 50 simulacoes registradas no banco de dados.
            </p>

            {erroHistorico && (
              <p className="erro">{erroHistorico}</p>
            )}

            {!erroHistorico && historico.length === 0 && (
              <p>Nenhuma simulacao registrada.</p>
            )}

            {historico.length > 0 && (
              <div className="tabela-rolagem">
                <table className="tabela-historico">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Data/hora (UTC)</th>
                      <th>Velocidade</th>
                      <th>Alvo X/Y</th>
                      <th>Tempo da bola</th>
                      <th>Resultado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {historico.map((registro) => (
                      <tr key={registro.id}>
                        <td>{registro.id}</td>
                        <td>{registro.data_hora}</td>
                        <td>
                          {registro.velocidade_bola.toFixed(1)} km/h
                        </td>
                        <td>
                          {registro.alvo_x.toFixed(2)} /{" "}
                          {registro.alvo_y.toFixed(2)} m
                        </td>
                        <td>
                          {registro.tempo_bola.toFixed(3)} s
                        </td>
                        <td
                          className={
                            registro.resultado === "GOL"
                              ? "texto-gol"
                              : "texto-defesa"
                          }
                        >
                          <strong>{registro.resultado}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </section>
      </main>
    </div>
  )
}

export default App
