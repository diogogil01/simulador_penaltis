# Contexto completo do projeto — Simulador de Pênaltis e Goleiro

Atualização inicial desta documentação: 23/10/2026.

> Finalidade: transferir para o repositório as decisões e restrições acumuladas no planejamento acadêmico. Este documento descreve objetivos e especificações, mas NÃO comprova que todas as funcionalidades estejam implementadas. Para o estado verificado, consulte ANDAMENTO.md e o código.

## 1. Identificação e finalidade

- Disciplina: Projeto em Engenharia da Computação I, FEAU/UNIVAP.
- Orientador/docente da disciplina: Prof. Me. Hélio Esperidião.
- Modalidade do trabalho: individual, conforme planejamento informado.
- Tema aceito: Simulador de Pênaltis e Goleiro.
- Natureza: desenvolvimento de software e simulação computacional, sem hardware físico.
- Objetivo geral: representar uma cobrança de pênalti, calcular a trajetória e o tempo de chegada da bola, modelar a reação e o deslocamento do goleiro e determinar o resultado da interação; mostrar os principais dados e registrar simulações em banco de dados.
- Ênfase: modelagem, física, algoritmos, integração de software, visualização, persistência e validação. Não tratar o trabalho somente como jogo.

O problema de engenharia é comparar a trajetória e o tempo disponível da bola com a capacidade de reação e de alcance de um goleiro modelado computacionalmente. O resultado deve ser reproduzível para parâmetros iguais.

## 2. Hierarquia das decisões

Em caso de dúvida, consultar nesta ordem:
1. Exigências explícitas do professor.
2. Aulas e materiais do professor.
3. Escopo mínimo aprovado e instruções atuais deste projeto.
4. Simplicidade, prazo e viabilidade.
5. Boas práticas de Engenharia da Computação.
6. Possíveis melhorias futuras.

Uma ideia citada num documento ou numa conversa antiga não se torna requisito obrigatório se tiver sido adiada, removida ou simplificada posteriormente. Reavaliar conflitos antes de programar.

## 3. MVP: funcionalidades esperadas

### Entradas e configuração

- Representação 2D do gol, bola, alvo e goleiro.
- Velocidade inicial do chute (unidade apresentada: km/h; converter internamente para m/s).
- Direção/alvo horizontal e altura/componente vertical do chute.
- Gravidade para a trajetória idealizada.
- Posição inicial do goleiro (central no protótipo atual).
- Tempo de reação do goleiro.
- Velocidade de deslocamento; aceleração apenas se necessária para um refinamento aprovado.
- Alcance do goleiro (horizontal e vertical, ainda simplificado).

### Processamento

- Calcular trajetória e tempo que a bola leva até a linha do gol.
- Determinar tempo disponível para deslocamento após a reação.
- Calcular distância máxima de deslocamento do goleiro.
- Comparar posição/tempo/alcance da bola e do goleiro.
- Classificar GOL ou DEFESA para um chute válido no modelo inicial.
- Tratar explicitamente entradas inválidas ou alvo fora do gol; a classificação própria PARA FORA não existe na implementação atual.

### Saída e persistência

- Animar/visualizar de forma simples gol, bola, alvo e goleiro.
- Exibir parâmetros, tempo de chegada, tempo de movimento, deslocamento e resultado.
- Persistir simulações num banco relacional ou NoSQL.
- Consultar histórico simples de simulações.

O banco de dados e o histórico são parte da meta acadêmica para entrega final, mesmo que a primeira entrega visual tenha sido autorizada sem banco.

## 4. Modelo matemático e físico

### 4.1. Coordenadas e hipóteses do protótipo

O desenho mostra o plano frontal do gol, com:
- eixo x: posição horizontal em metros, centro em x = 0;
- eixo y: altura do alvo em metros;
- distância da cobrança até a linha do gol D: 11,0 m;
- largura do gol L: 7,32 m, portanto -3,66 <= x <= +3,66 m;
- altura H: 2,44 m, portanto 0 <= y <= 2,44 m;
- gravidade g: 9,81 m/s², constante de simulação.

O cálculo do movimento usa a distância da bola ao gol além das duas coordenadas do alvo, embora a representação gráfica seja frontal 2D. A bola começa na altura zero no modelo matemático. Não há resistência do ar, rotação, vento, ressalto, colisão com trave/rede ou movimento realista dos braços. Essas são limitações declaradas, não características já resolvidas.

Os valores D, L, H e g acima constam no código inicial. Sua adoção e a pertinência dos valores de goleiro ainda precisam de referências/validação; não tratá-los como dados medidos pelo projeto.

### 4.2. Velocidade e tempo da bola — algoritmo implementado

Velocidade em m/s: v = velocidade_km_h / 3,6.

A implementação procura o tempo t de chegada a um alvo (x, y) usando a igualdade:

v² t² = D² + x² + (y + g t² / 2)²

Fazendo u = t², resolve-se:

a u² + b u + c = 0

onde:
- a = g² / 4;
- b = g y - v²;
- c = D² + x² + y²;
- discriminante delta = b² - 4 a c;
- para raízes u positivas, t = raiz_quadrada(u), escolhendo a menor t.

Unidades: v em m/s, D/x/y em m, g em m/s², t em s. Quando não existe raiz real positiva ou a velocidade não é positiva, a função retorna ausência de tempo. Este é um modelo idealizado de lançamento sem arrasto, assumindo velocidade inicial total fornecida e seleção da solução de menor tempo; não é uma simulação dinâmica passo a passo nem uma validação com lançamentos reais.

Arquivo: backend/app/physics/ball.py.

### 4.3. Movimento e defesa do goleiro — algoritmo implementado

- Velocidade do goleiro fixa no código: v_g = 5,0 m/s.
- Tempo útil para mover: t_mov = max(0, t_bola - t_reacao).
- Deslocamento máximo: d_g = v_g * t_mov.
- Distância horizontal do centro ao alvo: d_alvo = |x|.
- Verificação de defesa: (d_g >= d_alvo) E (y <= altura_goleiro).

Unidades: tempo em s, velocidade em m/s, distância e altura em m. O goleiro inicia implicitamente no centro, move-se horizontalmente com velocidade constante depois da reação e possui limite vertical simples. A posição do corpo, largura física, saltos, aceleração, raio da bola, trajetórias reais de defesa e colisão contínua ainda não são modelados. Não interpretar altura do goleiro como alcance validado de mãos/mergulho.

Arquivo: backend/app/physics/goalkeeper.py.

### 4.4. Valores de demonstração no frontend atual

São parâmetros escolhidos para demonstrar o protótipo — NÃO dados reais ou medições:
- velocidade da bola: 90 km/h;
- alvo x: 2,0 m;
- alvo y: 1,5 m;
- tempo de reação: 0,2 s;
- altura do goleiro: 1,90 m;
- velocidade do goleiro: 5,0 m/s, fixa no backend.

Não alterar valores ou interpretar seus significados físicos sem explicar a consequência para os cálculos.

## 5. Arquitetura de software atual

### 5.1. Tecnologias presentes no código

- Frontend: React, TypeScript, Vite e CSS.
- Backend: Python, FastAPI, Pydantic e Uvicorn.
- Comunicação: API REST, requisição HTTP POST com JSON; frontend local espera backend em http://localhost:8000.
- Banco de dados: **não implementado**. SQLite é candidato simples para persistência local relacional; PostgreSQL foi cogitado em discussões anteriores, mas NÃO é obrigação técnica definida.
- Não presumir serviços em nuvem, Docker, Redux, frameworks adicionais nem arquitetura distribuída.

### 5.2. Fluxo

Usuário define valores e/ou clica no gol -> frontend envia dados -> backend valida alvo, calcula tempo, movimento e verificação de defesa -> backend responde -> frontend mostra animação simplificada e resultados.

Principais arquivos:
- frontend/src/App.tsx — formulário, clique no gol, animação com temporizações e exibição.
- frontend/src/services/api.ts — POST /simulacoes.
- frontend/src/types/simulation.ts — contratos TypeScript.
- frontend/src/styles.css — representação visual.
- backend/app/main.py — aplicação FastAPI, CORS e registro de rotas.
- backend/app/routes/simulation_routes.py — POST /simulacoes e coordenação dos cálculos.
- backend/app/schemas/simulation_schema.py — dados de entrada/saída Pydantic.
- backend/app/physics/ball.py — cálculo da bola.
- backend/app/physics/goalkeeper.py — cálculo do goleiro.
- README.md — instruções do protótipo.

### 5.3. Comportamento que o código de 23/10/2026 descreve

- GET / retorna uma mensagem simples.
- POST /simulacoes recebe velocidade_bola, alvo_x, alvo_y, tempo_reacao e altura_goleiro.
- O endpoint verifica se x/y estão dentro dos limites do gol; alvo fora da moldura gera erro HTTP 400, e NÃO resultado PARA FORA.
- Se não há tempo de trajetória computável, retorna HTTP 400.
- Resposta de sucesso possui tempo_bola, tempo_movimento_goleiro, deslocamento_goleiro e resultado GOL ou DEFESA.
- O frontend possui campos numéricos, seleção de alvo por clique e animação esquemática por transições CSS e temporizadores.
- A animação não representa fielmente todas as coordenadas físicas em cada instante; serve como visualização inicial.
- O código inicial não define histórico, armazenamento, autenticação ou configuração persistente do usuário.
- Entradas negativas e algumas situações físicas/numéricas extremas ainda exigem revisão e validação.

Esses itens vêm da leitura do código, não de testes de execução completos.

## 6. Banco de dados obrigatório

O professor exige banco relacional ou NoSQL com utilidade real. A solução mínima prevista é registrar histórico de simulações.

Campos candidatos, sujeitos a revisão do modelo de dados:
- identificador;
- data e hora;
- velocidade inicial da bola;
- alvo/direção x e altura y;
- gravidade/modelo aplicado, quando útil;
- parâmetros e posição inicial do goleiro;
- tempo de reação;
- tempo de chegada da bola;
- tempo de movimento e deslocamento do goleiro;
- resultado;
- eventualmente status de simulação inválida separado do resultado esportivo.

O banco deve permitir registrar e consultar resultados. A tecnologia ainda deve ser avaliada pela simplicidade, manutenção, aprendizado e apresentação; não criar módulos extensos de usuários/cadastro sem necessidade.

## 7. Requisitos de referência para planejamento

Esta lista é uma tradução do escopo em requisitos-alvo; não é declaração de conclusão técnica.

### Funcionais

- RF01 — O sistema deve permitir informar velocidade e alvo/direção/altura do chute.
- RF02 — O sistema deve permitir definir os parâmetros essenciais do goleiro.
- RF03 — O sistema deve calcular a trajetória idealizada e o tempo da bola até o gol.
- RF04 — O sistema deve calcular o tempo e o deslocamento possível do goleiro após a reação.
- RF05 — O sistema deve determinar GOL ou DEFESA pelo modelo de alcance para chutes válidos.
- RF06 — O sistema deve apresentar representação/animação 2D simples.
- RF07 — O sistema deve exibir os dados principais e o resultado.
- RF08 — O sistema deve armazenar simulações em banco de dados.
- RF09 — O sistema deve permitir consultar o histórico.
- RF10 — O sistema deve rejeitar parâmetros inválidos de forma compreensível.

### Não funcionais

- RNF01 — Interface simples e compreensível.
- RNF02 — Cálculos determinísticos e com unidades definidas.
- RNF03 — Código organizado e passível de explicação e manutenção pelos integrantes.
- RNF04 — Execução viável em computador comum, sem hardware especial.
- RNF05 — Persistência consistente e tratamento de erros de entrada.
- RNF06 — Testes básicos reproduzíveis e documentação das limitações.
- RNF07 — Não incluir credenciais nem dados pessoais em repositório público.

Não foram definidos pelo professor números específicos de latência, carga, disponibilidade ou métricas de precisão; não inventar limites quantitativos.

## 8. Histórico de ideias e controle de escopo

Em discussões anteriores também foram considerados:
- modo Ponto (velocidade + clique no gol) e modo Manual (entrada de x/y); a versão atual contém clique e campos manuais, sem separação formal em telas/modos;
- faixas de chute fraco/médio/forte e níveis de goleiro/personalizado;
- posição inicial ajustável do goleiro, sua aceleração e alcance mais elaborado;
- login, perfis Usuário/Administrador/Desenvolvedor;
- gravidade selecionável Terra/Lua/Marte/gravidade zero;
- estados PARA FORA/TRAVE e exportação de resultados em PDF;
- escolha de PostgreSQL em plano anterior.

Essas ideias refletem explorações do planejamento e NÃO devem ser convertidas automaticamente em requisitos obrigatórios ou implementadas sem aprovação. O MVP mais recente prioriza a física simplificada, GOL/DEFESA, visualização e banco com histórico. Em 16/10/2026 foi explicitamente admitida uma entrega visual intermediária sem banco, mas isso não elimina a exigência do banco na entrega final.

Melhorias mais avançadas, somente depois de funcionar/validar: resistência do ar, rotação, Magnus, vento, 3D, IA/ML, Monte Carlo, dados reais, estatísticas avançadas.

## 9. Processo da disciplina e documentação

Fases ensinadas: Iniciação -> Planejamento -> Execução -> Monitoramento -> Encerramento.

- Iniciação: objetivo, responsáveis, prazo, recursos, custos, viabilidade, TAP e 5W2H (What, Why, Where, When, Who, How, How Much).
- Planejamento: escopo, cronograma, custos, qualidade, equipe, recursos, comunicação, riscos, partes interessadas e EAP.
- Execução: implementar progressivamente, integrar e testar em partes; ajustar planejamento quando necessário.
- Monitoramento: registrar concluído/em andamento/pendente, riscos, erros e próximos passos.
- Encerramento: testes finais, revisão, documentação, artigo, apresentação e lições aprendidas.

Manter rastreabilidade entre descrição inicial, TAP, 5W2H, requisitos, escopo, EAP, cronograma, implementação, testes, artigo e apresentação.

Calendário anteriormente informado pelo estudante: início em 07/08/2026, proposta em 14/08/2026 e conclusão/entrega planejada em 27/11/2026. Confirmar datas oficiais atualizadas no AVEA quando isso afetar decisões.

Exigências informadas pelo professor:
- trabalho individual ou dupla; este planejamento foi individual;
- acompanhamento semanal e atividades enviadas pelo AVEA;
- banco de dados relacional ou NoSQL obrigatório;
- projetos muito simples podem ser recusados e muito complexos podem ter escopo reduzido;
- consultoria externa não deve substituir a codificação pelos integrantes;
- entrega final: artigo no padrão INIC, sistema funcionando, apresentação de até 5 minutos e possibilidade de arguição individual.

Documento de requisitos: tomar como referência a estrutura IEEE/ANSI 830 apresentada nas aulas, adaptando ao projeto:
1. Introdução — propósito, escopo, definições, referências;
2. Descrição geral — perspectiva, funções, usuários, restrições, suposições;
3. Requisitos específicos — funcionais, não funcionais, desempenho, banco, qualidade;
4. Interfaces, casos de uso e fluxos, quando necessários, seguindo o modelo de aula.

Para documentação acadêmica, usar linguagem natural, simples e técnica, distinguindo premissas, resultados reais e limitações. Jamais inventar citação, medição ou referência bibliográfica.

## 10. Critérios de validação recomendados

Antes de afirmar conclusão, executar e registrar:
1. Instalação de dependências e inicialização do backend e frontend.
2. Abertura da página e chamada HTTP real do frontend para o backend.
3. Teste de chute válido com GOL e teste válido com DEFESA.
4. Teste de alvo fora do gol, velocidade zero e velocidade sem solução de trajetória.
5. Teste de tempo de reação maior que tempo de chegada.
6. Checagem dos limites geométricos e unidades dos parâmetros.
7. Revisão de entradas negativas e condições físicas impossíveis.
8. Quando houver banco: persistência real, recarga da aplicação e consulta ao histórico.
9. Registro de dados de teste e resultados observados, sem afirmar precisão de mundo real antes de comparar com fontes confiáveis.

Aproveitar futuramente fontes científicas e oficiais para validação da física, registrando a origem dos dados e o que foi comparado.

## 11. Documentos acadêmicos de origem

Materiais de referência fornecidos pelo estudante a este Projeto do ChatGPT (não foram adicionados ao repositório público):
- 01x01(1).pdf — Projeto de Desenvolvimento de Sistemas, Prof. Hélio Esperidião: ciclo do projeto, 5W2H, recursos, acompanhamento e regras da disciplina.
- 02x01(1).pdf — Requisitos do Usuário, Prof. Hélio Esperidião: requisitos funcionais e não funcionais, documento de requisitos e estrutura IEEE/ANSI 830.
- 02x01Documento requisitos.docx — modelo de documento de requisitos com casos de uso, prioridades e requisitos não funcionais.
- Proposta de Trabalho.docx — formulário de proposta de trabalho da FEAU/UNIVAP.
- Outros materiais acadêmicos e versões históricas podem existir fora deste repositório; solicitar acesso apenas se forem necessários para uma tarefa específica.

Este texto registra as decisões conhecidas; o código e as evidências de teste determinam a implementação efetiva.
