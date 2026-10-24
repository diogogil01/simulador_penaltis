# Orientações do Codex — Simulador de Pênaltis e Goleiro

Este repositório é um trabalho acadêmico da disciplina Projeto em Engenharia da Computação I (FEAU/UNIVAP). O sistema deve ser compreensível e explicável pelo estudante, não apenas demonstrável.

## Antes de começar qualquer tarefa

1. Leia este arquivo, CONTEXTO_PROJETO.md, ANDAMENTO.md e README.md.
2. Confira o código atual antes de concluir que algo funciona. O código é a fonte para saber o que está implementado; ANDAMENTO.md registra o que já foi comprovadamente testado.
3. Se os documentos entrarem em conflito, não escolha silenciosamente: explique o conflito, preserve o escopo mínimo e solicite decisão. As exigências do professor e o escopo atual aprovado prevalecem sobre ideias antigas.
4. Em análises, diga o que é fato observado, hipótese, proposta ou pendência.

## Prioridades e escopo

- Ordem: fazer o básico funcionar -> validar -> melhorar.
- MVP: representação 2D do gol, bola e goleiro; parâmetros do chute; gravidade; trajetória e tempo de chegada da bola; posição/reação/movimento/alcance do goleiro; verificação de GOL ou DEFESA; visualização simples; dados calculados; banco de dados e histórico de simulações.
- Não introduza hardware, 3D, resistência do ar, vento, rotação, efeito Magnus, IA, machine learning, Monte Carlo, dados de partidas reais ou estatística avançada sem autorização.
- Login, perfis, gravidade por planeta, TRAVE e PARA FORA como resultados próprios e exportação PDF são ideias discutidas anteriormente; não são compromissos do MVP atual.
- Banco de dados é obrigatório para a entrega final da disciplina, mas ainda não existe no código inicial. Não o descreva como já implementado.

## Forma de trabalhar

- Use a estrutura atual: backend Python/FastAPI; frontend React/TypeScript/Vite.
- Priorize código simples, nomes claros, funções pequenas, poucas dependências, comentários curtos quando úteis e explicações didáticas em português.
- Não reestruture o projeto, troque tecnologias ou crie funcionalidades novas sem necessidade e sem aprovação.
- Antes de editar arquivos, apresente brevemente: problema, proposta, arquivos afetados e como testar; peça aprovação quando a alteração ainda não tiver sido expressamente autorizada.
- Execute uma etapa pequena por vez. Mostre o resultado do teste e os erros encontrados. Não declare que funcionou sem evidência.
- Nunca crie valores de testes ou resultados experimentais fingindo que foram medidos.
- Não armazene senhas, tokens, informações pessoais ou segredos no repositório público.
- Não faça commit, push, instalação de ferramentas, publicação ou mudanças externas sem autorização do usuário, salvo quando isso fizer parte explícita do pedido.

## Física, dados e qualidade

- Explique fórmulas com variáveis, unidades, hipóteses e aplicação no simulador.
- Diferencie parâmetros escolhidos para o protótipo, estimativas, dados reais e medições.
- Verifique entradas inválidas, limites do gol, casos extremos, integração entre frontend/backend e cálculos com exemplos reproduzíveis.
- Trate colisão/defesa como aproximação do MVP, sem afirmar realismo esportivo não validado.
- Após mudanças aprovadas e verificadas, atualize ANDAMENTO.md com estado, evidência, limitações e próximo passo; atualize CONTEXTO_PROJETO.md apenas se houver decisão de escopo/arquitetura.

## Fluxo de resposta recomendado

1. Situação encontrada.
2. Próxima ação mínima.
3. Explicação simples da lógica.
4. Arquivos afetados e teste previsto.
5. Solicitação de autorização quando necessária.

A documentação acadêmica segue os materiais do professor, com linguagem clara e sem referências inventadas.
