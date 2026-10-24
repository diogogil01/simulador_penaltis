# Simulador de Penaltis e Goleiro

Primeira versao visual do projeto.

## tecnologias

- react
- typescript
- vite
- python
- fastapi
- api rest

## modelo atual

O usuario informa:

- velocidade da bola
- posicao horizontal do chute
- altura do chute
- tempo de reacao do goleiro
- altura do goleiro

A velocidade do goleiro e fixa em 5.0 m/s nesta versao.

A defesa considera dois pontos:

1. o goleiro precisa conseguir chegar na posicao horizontal da bola
2. a altura da bola precisa estar dentro da altura do goleiro

Este modelo ainda e simplificado e sera melhorado nas proximas etapas.

## como iniciar o backend

Abra um terminal na pasta `backend`.

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

Documentacao da api:

```text
http://localhost:8000/docs
```

## como iniciar o frontend

Abra outro terminal na pasta `frontend`.

```powershell
npm install
npm run dev
```

Normalmente o frontend fica em:

```text
http://localhost:5173
```
