# DECISIONS.md — Log de Decisões

Registro das decisões técnicas e de design tomadas durante o desenvolvimento.
Consultar antes de reabrir qualquer discussão.

---

## Decisões Técnicas

### DEC-001 — Node.js em vez de Python
**Data:** início do projeto
**Decisão:** Node.js com TypeScript
**Alternativa considerada:** Python com Textual
**Razão:** Familiaridade do autor com JavaScript/TypeScript.
A velocidade de geração de IA não é afetada pela linguagem (gargalo é o modelo).
Ink (React para terminal) é familiar para quem conhece React.
Migração para Electron (V2) é mais natural com Node.
**Status:** definitiva

---

### DEC-002 — Ink para interface CLI
**Data:** início do projeto
**Decisão:** Ink (React para terminal)
**Alternativa considerada:** Blessed, Blessed-contrib
**Razão:** Ink usa paradigma declarativo (React), mais fácil de manter.
Migração para Electron + xterm.js (V2) preserva os componentes.
**Ressalva:** Bordas ASCII rústicas são desenhadas manualmente via componente
`AsciiBorder` — não usamos `borderStyle` do Ink.
**Status:** definitiva

---

### DEC-003 — Bordas ASCII rústicas, não Unicode
**Data:** definição de estilo visual
**Decisão:** Caracteres ASCII (`+`, `=`, `|`, `*`, `-`) em vez de box-drawing Unicode (╔, ═, ║)
**Razão:** Estética retrô/rústica solicitada. Unicode moderno parece "limpo demais".
**Implementação:** Componente `AsciiBorder` com variantes em `src/ui/components/`.
Fácil adicionar novas variantes sem alterar código de telas.
**Status:** definitiva

---

### DEC-004 — AI provider abstraído via interface
**Data:** início do projeto
**Decisão:** Interface `AIProvider` com providers separados (Ollama, Anthropic, OpenAI, Mock)
**Razão:** Desenvolvimento usa Ollama local (sem custo). Produção pode usar Anthropic.
Testes sempre usam MockAIProvider (determinístico, rápido).
Troca via `.env` sem alterar código.
**Status:** definitiva

---

### DEC-005 — Ollama como provider padrão
**Data:** início do projeto
**Decisão:** Ollama (local) como padrão de desenvolvimento
**Alternativa considerada:** API Anthropic diretamente
**Razão:** Sem custo por token durante desenvolvimento. Funciona offline.
Latência de 2-10s por geração é aceitável em jogo (dá pra animar com loading).
**Modelo recomendado:** `llama3.1:8b` ou `mistral:7b` (equilibra qualidade e velocidade)
**Status:** definitiva para dev, Anthropic recomendado para produção

---

### DEC-006 — Conteúdo em YAML + Markdown, não hardcoded
**Data:** início do projeto
**Decisão:** Todos os eventos, inimigos e classes em `data/*.yaml`.
Lore e world-building em `data/*.md` com frontmatter.
**Razão:** Permite editar história sem recompilar. Permite que o agente de IA
gere conteúdo sem tocar em código TypeScript. Facilita colaboração futura.
**Validação:** Zod em runtime no ContentLoader — erros de schema aparecem na inicialização.
**Status:** definitiva

---

### DEC-007 — Funções puras na engine com RNG injetável
**Data:** implementação do sistema de combate
**Decisão:** Todos os sistemas de combat/dice/effects recebem `RngFn` opcional.
Padrão é `Math.random()`, testes injetam função determinística.
**Razão:** Permite testar comportamentos de combate sem aleatoriedade.
Permite seeds de run que garantem dungeons reproduzíveis.
**Padrão:**
```typescript
export type RngFn = () => number
const defaultRng: RngFn = () => Math.random()
export const roll = (die, count, modifier, rng = defaultRng) => { ... }
```
**Status:** definitiva

---

### DEC-008 — Separação engine vs game
**Data:** início do projeto
**Decisão:** `src/engine/` não conhece nada de Ashborne especificamente.
`src/game/` usa a engine como biblioteca.
**Razão:** Futuramente a engine pode ser extraída como lib separada ou
comercializada. Engine boa nasce de produto real — não o contrário.
**Regra prática:** Se pode ser usado em outro jogo sem modificação → engine.
Se é específico de Ashborne → game.
**Status:** definitiva

---

### DEC-009 — lowdb para persistência
**Data:** início do projeto
**Decisão:** lowdb (JSON simples) para saves e meta-progressão
**Alternativa considerada:** SQLite, arquivo JSON manual
**Razão:** Sem overhead de banco de dados. JSON legível (útil para debug).
Dados de save são simples — não justificam SQL.
**Status:** definitiva

---

### DEC-010 — ESM com `tsx`
**Data:** início do projeto
**Decisão:** ESM, rodado via `tsx` (TypeScript runtime)
**Razão:** `tsx` resolve imports TypeScript nativamente sem necessidade de `.js` no final.
Compatível com Vite para testes (vitest). Futuro Electron preserva compatibilidade.
**Consequência:** Imports não precisam de extensão — o `tsx` e o `vite` resolvem via `tsconfig.json` path aliases.
**Status:** definitiva

---

## Decisões de Design

### DEC-D001 — Roguelite, não roguelike puro
**Data:** definição do projeto
**Decisão:** Meta-progressão entre runs (desbloqueios, lore, pequenos bônus)
**Razão:** Meta-progressão serve à narrativa — fragmentos de lore revelados
gradualmente. Também mantém o jogador investido entre runs perdidas.
**Ressalva:** Bônus permanentes são pequenos — não devem trivializar runs.
**Status:** definitiva

---

### DEC-D002 — Combate D&D clássico, não deck de cartas
**Data:** definição do projeto
**Decisão:** Atributos, dados visíveis, ações baseadas em habilidades equipadas
**Alternativa considerada:** Slay the Spire (deck de cartas)
**Razão:** Tom de fantasia épica combina mais com D&D. O autor prefere.
Dados visíveis na tela reforçam a estética retrô.
**Status:** definitiva

---

### DEC-D003 — Sem alinhamento moral explícito
**Data:** definição narrativa
**Decisão:** `moralScore` existe mas nunca é exibido diretamente ao jogador.
Sem label "Bom/Mau/Neutro". Sem penalidade mecânica explícita.
**Razão:** Zona cinzenta intencional. O mundo reage, não julga.
Alinhamento explícito encorajaria "gaming o sistema" em vez de roleplay genuíno.
**Efeito:** Narrador muda tom, NPCs reagem diferente — tudo sutil.
**Status:** definitiva

---

### DEC-D004 — IA gera texto, não mecânicas
**Data:** início do projeto
**Decisão:** IA sempre chamada *após* resolução mecânica. Texto narrativo apenas.
**Razão:** IA local tem latência. IA não deve afetar resultado de combate
(cria comportamento imprevisível e injusto). IA enriquece, não define.
**Regra:** O dano já foi calculado quando o Narrator descreve o golpe.
**Status:** definitiva

---

### DEC-D005 — Twist principal nunca escrito explicitamente
**Data:** definição narrativa
**Decisão:** A revelação de que meta-progressão alimenta o ciclo nunca aparece
em texto direto. O jogador chega lá pelos fragmentos.
**Razão:** Consistente com referências (Dark Souls, Bloodborne). O prazer é
na descoberta, não na revelação. Jogadores que não chegam lá têm uma
experiência válida também.
**Status:** definitiva

---

### DEC-D006 — Vitória "secreta" para quebrar o ciclo
**Data:** definição narrativa
**Decisão:** Existe um final alternativo obtido jogando sem meta-progressão.
Nunca documentado in-game. Descoberta orgânica.
**Razão:** Recompensa jogadores que questionam os sistemas do jogo.
Consistente com a filosofia narrativa (menos poder = mais liberdade).
**Status:** definitiva

---

### DEC-011 — I18n sem biblioteca externa
**Data:** definição de arquitetura
**Decisão:** Sistema de internacionalização próprio via JSON + classe `I18n` na engine.
Sem libs externas (i18next, react-intl, etc.).
**Razão:** O jogo tem volume baixo de strings de UI. Uma classe simples com
`t(key)` e `tContent(field)` resolve o problema sem overhead de dependência.
A complexidade de i18next não se justifica aqui.
**Estrutura:**
- Strings de UI: `data/i18n/{locale}.json`
- Conteúdo YAML: campos multilíngues `{ pt: "...", en: "..." }`
- Prompts da IA: chave `narrator_tone` no JSON de cada locale
- Idioma via `.env`: `GAME_LOCALE=pt`
**Idiomas iniciais:** `pt` (padrão), `en`
**Regra derivada:** Nunca hardcodar string visível ao jogador. Sempre `i18n.t()`.
**Prioridade:** Implementar antes de qualquer tela de UI.
**Status:** definitiva

### DEC-D007 — Regiões abertas em vez de salas fechadas
**Data:** definição de gameplay
**Decisão:** O jogador atravessa regiões de Ashborne com pontos de interesse,
não "salas" de dungeon estilo Binding of Isaac.
**Razão:** O tom do jogo exige sensação de mundo vasto e perturbador.
Salas fechadas criam sensação de corredor/caixa incompatível com o universo.
**Exceção intencional:** O Convento (região 3) e as Catacumbas (região 4)
são explicitamente fechados — para criar contraste claustrofóbico com o
espaço aberto das demais regiões. O fechamento é narrativo, não estrutural.
**Impacto técnico:** `PointOfInterest` ganha `locationName` e `locationDescription`.
`RegionNode` ganha `regionId` e `isEnclosed`. Mapa usa pontos e traços
em vez de boxes. Narrator ganha método `describeTransition()`.
**Estrutura técnica:** grafo de nós — não muda. Só a apresentação muda.
**Status:** definitiva

---

### DEC-D008 — Criação de personagem em 3 telas, sem distribuição manual de pontos
**Data:** definição de gameplay
**Decisão:** Criação de personagem em 3 telas sequenciais: escolha de classe →
nome → confirmação. Atributos definidos completamente pela classe escolhida.
Sem distribuição manual de pontos.
**Alternativa considerada:** Distribuição livre de pontos iniciais (como D&D clássico)
**Razão:** Simplicidade e foco. O roguelite recompensa runs rápidas — uma tela
de criação complexa atrita contra isso. A identidade da classe é mais clara
quando os atributos são fixos. Customização vem do level up, não da criação.
**Level up:** única escolha — +3 num atributo. Uma decisão, sem sobrecarga.
**SAB como atributo secretamente importante:** resiste à Força da Entidade e
abre ramificações em diálogos Ink. Nunca explicado ao jogador diretamente.
**Status:** definitiva

### DEC-D009 — Input livre com classificação local, texto nunca vai à IA
**Data:** definição de gameplay
**Decisão:** Input livre do jogador é classificado localmente via regex antes de
qualquer chamada à IA. O texto original nunca entra no prompt. Apenas a intent
classificada é passada. Guard rails protegem segredos narrativos.
**Razão:** Input livre direto à IA é superfície de ataque narrativa — o jogador
pode forçar saída de contexto, quebrar personagem, ou revelar twists.
A classificação local é determinística, sem custo e sem latência.
**PROTECTED_SECRETS:** lista de verdades que a IA nunca pode confirmar:
ciclo alimentado pelos heróis, Oráculo como primeira heroína, meta-progressão
como armadilha, existência do final secreto.
**Quando disponível:** apenas em conversas com NPCs recorrentes após apresentação
via Ink. Nunca em combate, eventos de escolha, sonhos ou primeiro encontro.
**Status:** definitiva

### DEC-D010 — Frase de abertura do jogo
**Data:** definição de tom
**Decisão:** A frase de abertura é a primeira coisa que o jogador vê antes do menu.
Opção preferida: *"Ah. Mais um."* — dita por Diógenes.
**Razão:** Condensa o tom do jogo em duas palavras. Diógenes viu isso tantas vezes
que nem tem energia pra explicar. O jogador não sabe o peso disso na primeira run —
mas na décima, sente. Em inglês: *"Oh. Another one."*
**Implementação:** texto estático exibido na tela de abertura antes do menu principal,
com pausa de 2-3 segundos antes de revelar as opções.
**Status:** definitiva

---

## Decisões Adiadas (V2+)

| Decisão | Motivo do adiamento |
|---|---|
| Electron + xterm.js | Complexidade desnecessária para V1 |
| Fonte pixelada customizada | Depende do Electron |
| Distribuição Steam / proteção de código | V2 |
| Extrair engine como lib separada | Nasce do jogo, não antes |
| Multiplataforma binário | V2 |
