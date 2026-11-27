# Simulador de Pênaltis e Goleiro

Projeto em Engenharia da Computação I — UNIVAP, 2026.

## Arquitetura
Frontend React/TypeScript/Vite, backend Python/FastAPI e banco relacional SQLite.
O modelo idealizado considera gravidade, alvo, velocidade da bola e tempo de reação. O goleiro parte do centro, desloca-se a até 5 m/s (valor fixo) e tem alcance vertical simplificado pela altura informada.

## Execução no Windows
Pré-requisitos: Python e Node.js compatível com Vite 7 (20.19+ ou 22.12+), npm.
Abra dois terminais na raiz do projeto.

Terminal 1:
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host localhost --port 8000
```
Terminal 2:
```powershell
cd frontend
npm ci
npm run dev -- --host localhost --port 5173
```
Acesse http://localhost:5173 e a documentação da API em http://localhost:8000/docs.
Para compilar o frontend: `npm run build`.
Se as dependências já estiverem instaladas, não é necessário reinstalá-las.

## Banco de dados
`backend/simulacoes.db` contém 7 registros originais (5 GOL, 2 DEFESA).
`banco/backup_simulacoes.sql` contém a exportação SQL dos mesmos dados.
A tabela é criada automaticamente quando a API salva ou consulta uma simulação.
GET /simulacoes lista os últimos 50 registros por ID decrescente.
POST /simulacoes calcula e grava o resultado.
O arquivo do banco é ignorado pelo Git, mas incluído neste pacote para demonstração.

## Demonstração
90 km/h, X=2, Y=1,5, reação=0,2 s, altura=1,90 m: GOL.
Com X=0 e demais parâmetros iguais: DEFESA.
Confirme a tabela de histórico e atualize a página para mostrar persistência.
