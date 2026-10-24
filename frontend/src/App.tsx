import { useState } from "react"
import { simularPenalti } from "./services/api"
import type { ResultadoSimulacao } from "./types/simulation"

function App() {
  // dados do chute
  const [velocidade, setVelocidade] = useState(90)
  const [alvoX, setAlvoX] = useState(2)
  const [alvoY, setAlvoY] = useState(1.5)

  // dados do goleiro
  const [tempoReacao, setTempoReacao] = useState(0.2)
  const [alturaGoleiro, setAlturaGoleiro] = useState(1.90)

  // dados da animacao
  const [resultado, setResultado] =
    useState<ResultadoSimulacao | null>(null)

  const [erro, setErro] = useState("")
  const [animando, setAnimando] = useState(false)
  const [bolaNoAlvo, setBolaNoAlvo] = useState(false)
  const [goleiroX, setGoleiroX] = useState(0)
  const [duracaoBola, setDuracaoBola] = useState(1000)
  const [duracaoGoleiro, setDuracaoGoleiro] = useState(500)

  function resetar() {
    // volta a simulacao para o inicio
    setResultado(null)
    setErro("")
    setAnimando(false)
    setBolaNoAlvo(false)
    setGoleiroX(0)
  }

  function escolherAlvo(
    evento: React.MouseEvent<HTMLDivElement>
  ) {
    // nao altera o alvo durante a simulacao
    if (animando) {
      return
    }

    // pega o tamanho e a posicao do gol
    const gol = evento.currentTarget
    const area = gol.getBoundingClientRect()

    // calcula a posicao do clique dentro do gol
    const cliqueX = evento.clientX - area.left
    const cliqueY = evento.clientY - area.top

    // converte pixels para metros
    let novoX = (cliqueX / area.width) * 7.32 - 3.66
    let novoY = ((area.height - cliqueY) / area.height) * 2.44

    // limita o alvo dentro do gol
    novoX = Math.max(-3.66, Math.min(3.66, novoX))
    novoY = Math.max(0, Math.min(2.44, novoY))

    // atualiza os campos e o ponto vermelho
    setAlvoX(Number(novoX.toFixed(2)))
    setAlvoY(Number(novoY.toFixed(2)))

    // limpa a simulacao anterior
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
      const resposta = await simularPenalti({
        velocidade_bola: velocidade,
        alvo_x: alvoX,
        alvo_y: alvoY,
        tempo_reacao: tempoReacao,
        altura_goleiro: alturaGoleiro
      })

      // aumenta o tempo apenas para a animacao ficar visivel
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

      // calcula a direcao do movimento
      const direcao = alvoX < 0 ? -1 : 1

      const deslocamentoVisual = Math.min(
        Math.abs(alvoX),
        resposta.deslocamento_goleiro
      ) * direcao

      // pequeno atraso para iniciar a transicao
      setTimeout(() => {
        setBolaNoAlvo(true)
      }, 50)

      // goleiro comeca a se mover depois da reacao
      setTimeout(() => {
        setGoleiroX(deslocamentoVisual)
      }, tempoVisualReacao)

      // mostra o resultado quando a bola chega
      setTimeout(() => {
        setResultado(resposta)
        setAnimando(false)
      }, tempoVisualBola + 80)

    } catch {
      setErro("nao foi possivel realizar a simulacao")
      setAnimando(false)
    }
  }

  const alvoLeft = 50 + (alvoX / 7.32) * 100
  const alvoBottom = (alvoY / 2.44) * 100

  const bolaLeft = bolaNoAlvo ? alvoLeft : 50
  const bolaBottom = bolaNoAlvo ? alvoBottom : 2

  const goleiroLeft =
    50 + (goleiroX / 7.32) * 100

  // ajusta a altura visual do goleiro
  const alturaVisualGoleiro =
    Math.max(85, Math.min(145, alturaGoleiro * 63))

  return (
    <div className="pagina">
      <header className="cabecalho">
        <h1>Simulador de Penaltis e Goleiro</h1>
        <p>primeiro prototipo funcional</p>
      </header>

      <main className="conteudo">
        <section className="painel">
          <h2>parametros do chute</h2>

          <label>velocidade da bola (km/h)</label>
          <input
            type="number"
            value={velocidade}
            disabled={animando}
            onChange={(e) =>
              setVelocidade(Number(e.target.value))
            }
          />

          <label>posicao horizontal x (m)</label>
          <input
            type="number"
            step="0.1"
            value={alvoX}
            disabled={animando}
            onChange={(e) =>
              setAlvoX(Number(e.target.value))
            }
          />

          <label>altura y (m)</label>
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
            voce tambem pode clicar diretamente no gol para escolher o alvo
          </p>

          <h2>parametros do goleiro</h2>

          <label>tempo de reacao (s)</label>
          <input
            type="number"
            step="0.01"
            value={tempoReacao}
            disabled={animando}
            onChange={(e) =>
              setTempoReacao(Number(e.target.value))
            }
          />

          <label>altura do goleiro (m)</label>
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
            a velocidade do goleiro e fixa nesta versao
          </p>

          <button
            onClick={simular}
            disabled={animando}
          >
            {animando ? "simulando..." : "simular"}
          </button>

          <button
            className="botao-secundario"
            onClick={resetar}
            disabled={animando}
          >
            resetar
          </button>

          {erro && <p className="erro">{erro}</p>}
        </section>

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

          <div className="resultado">
            {animando && (
              <p className="status">
                simulacao em andamento...
              </p>
            )}

            {!animando && !resultado && (
              <p>
                escolha o alvo e clique em simular
              </p>
            )}

            {resultado && (
              <>
                <h2 className={
                  resultado.resultado === "GOL"
                    ? "texto-gol"
                    : "texto-defesa"
                }>
                  {resultado.resultado}
                </h2>

                <p>
                  tempo da bola:{" "}
                  <strong>
                    {resultado.tempo_bola.toFixed(3)} s
                  </strong>
                </p>

                <p>
                  tempo de movimento do goleiro:{" "}
                  <strong>
                    {resultado.tempo_movimento_goleiro.toFixed(3)} s
                  </strong>
                </p>

                <p>
                  deslocamento do goleiro:{" "}
                  <strong>
                    {resultado.deslocamento_goleiro.toFixed(2)} m
                  </strong>
                </p>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
