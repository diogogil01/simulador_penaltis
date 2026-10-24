# Andamento do projeto — Simulador de Pênaltis e Goleiro

Data de referência: 23/10/2026.
Repositório: https://github.com/diogogil01/simulador_penaltis
Branch principal: main.

## Como interpretar este documento

- **Presente no código**: o arquivo e a lógica foram inspecionados; isso não prova execução correta.
- **Comprovado**: existe evidência efetiva de execução/teste relatada ou registrada.
- **Pendente**: não há implementação identificada ou teste suficiente.
- **Planejado**: faz parte do objetivo, mas ainda não foi executado.

Este registro é deliberadamente conservador: não confundir geração de código com software validado.

## 1. Linha de base do repositório

- Em 23/10/2026 foi publicado o primeiro conjunto de 23 arquivos com backend FastAPI e frontend React/TypeScript/Vite.
- Commit de referência do código inicial: 8f08f1aef9633df64af5665cb5b289c50f588ebc.
- O repositório contém README.md, .gitignore, código do frontend e backend e configuração de dependências.
- A descrição dos arquivos foi confirmada por análise do Codex no VS Code, segundo saída fornecida pelo estudante.
- O Codex leu os arquivos corretamente; nenhum arquivo foi alterado durante essa primeira análise.
- **Não consta comprovação neste histórico de que backend, frontend, simulação ponta a ponta ou testes automatizados tenham sido executados com sucesso.**

## 2. Quadro de implementação e comprovação

| Item | Implementação no código inicial | Comprovação atual |
| --- | --- | --- |
| Estrutura frontend React/TypeScript/Vite | Presente | Leitura de arquivos; execução não verificada |
| Estrutura backend Python/FastAPI | Presente | Leitura de arquivos; execução não verificada |
| Formulário de parâmetros do chute/goleiro | Presente | Interface em navegador não verificada |
| Clique no gol para selecionar alvo | Presente | Interação visual não verificada |
| Cálculo de tempo da bola com gravidade | Presente | Correção física e casos-limite não validados |
| Tempo de reação e deslocamento do goleiro | Presente | Resultados não validados |
| Regra simplificada de GOL/DEFESA | Presente | Testes GOL/DEFESA não comprovados |
| Animação esquemática por CSS/temporizadores | Presente | Execução visual não verificada |
| API POST /simulacoes | Presente | Requisição real não verificada |
| Exibição de tempos e deslocamento | Presente | Integração não verificada |
| Validação de entradas | Parcial | Limites x/y e ausência de trajetória tratados; outros casos pendentes |
| Banco de dados de simulações | Pendente | Não há persistência no código inicial |
| Histórico de simulações | Pendente | Depende do banco de dados |
| Testes automatizados | Pendente | Não identificados na versão inicial |
| Artigo e apresentação final | Em planejamento acadêmico | Entregas finais não verificadas |

## 3. Limitações conhecidas a revisar

1. O backend rejeita alvo fora do gol com HTTP 400; não há resultado específico PARA FORA.
2. A velocidade horizontal do goleiro é fixa em 5,0 m/s, e sua posição inicial é central implícita.
3. O alcance vertical equivale à altura informada do goleiro, sem salto/colisão detalhada.
4. A animação é uma transição ilustrativa entre posições, não a reprodução exata da trajetória física a cada instante.
5. Não há persistência, histórico ou consulta por simulação.
6. Entradas inválidas e parâmetros negativos/extremos precisam de validação antes de apresentação como resultado físico confiável.
7. Não foi realizada validação científica ou comparação com dados medidos.
8. Não há comprovação de execução completa do frontend/backend neste registro.

## 4. Sequência de desenvolvimento recomendada

### Etapa A — Fazer a versão atual rodar

- [ ] Verificar versões instaladas de Python, Node.js e npm.
- [ ] Instalar as dependências Python em ambiente virtual.
- [ ] Iniciar a API e verificar GET / e POST /simulacoes.
- [ ] Instalar as dependências do frontend e iniciar o Vite.
- [ ] Abrir a página no navegador e fazer uma simulação completa.
- [ ] Corrigir somente falhas encontradas e registrar evidências.

### Etapa B — Validar a modelagem mínima

- [ ] Calcular manualmente e comparar pelo menos um cenário de tempo da bola.
- [ ] Confirmar um cenário de GOL e um de DEFESA.
- [ ] Conferir unidades, limite do gol e tempo de reação.
- [ ] Tratar entradas inválidas com mensagens claras.
- [ ] Avaliar se visualização, dados e regra de defesa correspondem ao MVP.
- [ ] Registrar simplificações assumidas e resultados obtidos.

### Etapa C — Persistência obrigatória

- [ ] Escolher o banco relacional/NoSQL mais simples para o caso, justificando.
- [ ] Definir estrutura mínima dos registros de simulação.
- [ ] Gravar parâmetros e resultado após simulação válida.
- [ ] Implementar consulta/listagem do histórico.
- [ ] Testar persistência após reiniciar o sistema.

### Etapa D — Integração e entrega acadêmica

- [ ] Executar testes integrados e documentar cenários.
- [ ] Atualizar os requisitos e a documentação para refletir o que foi entregue.
- [ ] Preparar e revisar artigo no padrão INIC com resultados reais.
- [ ] Preparar demonstração do sistema e apresentação de no máximo 5 minutos.
- [ ] Treinar explicação das fórmulas, implementação, banco e limitações.

Não iniciar melhorias opcionais antes de A, B e C estarem funcionando, salvo decisão expressa.

## 5. Decisões registradas

| Decisão | Situação |
| --- | --- |
| Projeto inteiramente em software | Confirmada; sem hardware |
| MVP 2D e cálculos idealizados | Escopo prioritário |
| Stack da implementação inicial React/TypeScript/Vite + Python/FastAPI | Existente no código; não trocar sem justificativa |
| Resultados principais GOL/DEFESA | Regra do código inicial; outras classificações não são obrigatórias |
| Banco e histórico para atender professor | Obrigatórios para entrega final, ainda pendentes |
| Ideias como 3D, Magnus, IA, login, planetas e PDF | Fora do MVP ou sujeitas a nova autorização |
| Codex como apoio à programação | Adotado; trabalhar com aprovações e explicações |
| Arquivos AGENTS.md, CONTEXTO_PROJETO.md e ANDAMENTO.md | Documentação de trabalho, sem alteração do código da aplicação |

## 6. Modelo para futuras atualizações

Ao terminar uma atividade, registrar brevemente:

- Data:
- Objetivo da atividade:
- Arquivos modificados:
- O que foi realmente executado/testado:
- Resultado observado:
- Problemas e limitações:
- Próximo passo:
- Commit/PR, se houver:

Não marcar como concluído algo que foi somente planejado ou escrito, sem validação adequada.

## 7. Atenções de planejamento

- O calendário historicamente informado termina em 27/11/2026; verificar atualizações no AVEA.
- O professor exige acompanhamento semanal, banco de dados e compreensão individual do projeto.
- No repositório público, evitar dados pessoais, credenciais e documentos não autorizados.
- Manter diferenças entre parâmetros do protótipo, estimativas, evidências de teste e dados reais.
