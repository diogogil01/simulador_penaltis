import sqlite3
from pathlib import Path

# Caminho do arquivo do banco de dados
PASTA_BACKEND = Path(__file__).resolve().parent.parent
CAMINHO_BANCO = PASTA_BACKEND / "simulacoes.db"


# ==========================================
# 1. CRIAR O BANCO DE DADOS
# ==========================================


def inicializar_banco():
    # Abre ou cria o banco de dados
    conexao = sqlite3.connect(CAMINHO_BANCO)
    cursor = conexao.cursor()

    # Cria a tabela caso ela ainda nao exista
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS simulacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data_hora TEXT DEFAULT CURRENT_TIMESTAMP,
            velocidade_bola REAL NOT NULL,
            alvo_x REAL NOT NULL,
            alvo_y REAL NOT NULL,
            tempo_reacao REAL NOT NULL,
            altura_goleiro REAL NOT NULL,
            tempo_bola REAL NOT NULL,
            tempo_movimento_goleiro REAL NOT NULL,
            deslocamento_goleiro REAL NOT NULL,
            resultado TEXT NOT NULL
        )
    """)

    conexao.commit()
    conexao.close()


# ==========================================
# 2. SALVAR UMA SIMULACAO
# ==========================================


def salvar_simulacao(dados, resposta):
    # Garante que a tabela existe
    inicializar_banco()

    conexao = sqlite3.connect(CAMINHO_BANCO)

    try:
        cursor = conexao.cursor()

        cursor.execute(
            """
            INSERT INTO simulacoes (
                velocidade_bola,
                alvo_x,
                alvo_y,
                tempo_reacao,
                altura_goleiro,
                tempo_bola,
                tempo_movimento_goleiro,
                deslocamento_goleiro,
                resultado
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                dados.velocidade_bola,
                dados.alvo_x,
                dados.alvo_y,
                dados.tempo_reacao,
                dados.altura_goleiro,
                resposta.tempo_bola,
                resposta.tempo_movimento_goleiro,
                resposta.deslocamento_goleiro,
                resposta.resultado,
            ),
        )

        conexao.commit()

    finally:
        conexao.close()


# ==========================================
# 3. CONSULTAR O HISTORICO
# ==========================================


def listar_simulacoes():
    # Garante que a tabela existe
    inicializar_banco()

    conexao = sqlite3.connect(CAMINHO_BANCO)

    # Permite acessar as colunas pelo nome
    conexao.row_factory = sqlite3.Row

    try:
        cursor = conexao.cursor()

        # Busca as ultimas 50 simulacoes
        cursor.execute("""
            SELECT *
            FROM simulacoes
            ORDER BY id DESC
            LIMIT 50
        """)

        registros = cursor.fetchall()

        # Converte os registros em dicionarios
        return [dict(registro) for registro in registros]

    finally:
        conexao.close()


# ==========================================
# 4. EXECUCAO DIRETA
# ==========================================

if __name__ == "__main__":
    inicializar_banco()
    print("Banco de dados criado com sucesso!")
