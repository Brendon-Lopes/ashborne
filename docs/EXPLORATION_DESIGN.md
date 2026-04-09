# EXPLORATION_DESIGN.md — Decisões de Navegação e Exploração

> **Status:** Decisão de design aprovada
> **Data:** 7 de abril de 2026
> **Relacionado:** `architecture.md`, `storytelling.md`, roadmap (Fase 8–9)

---

## Problema

RPGs textuais correm o risco de fazer o jogador se sentir num **menu de opções** ao invés de **explorando um mundo**. O desafio é dar sensação de liberdade e profundidade sem um mapa visual, usando apenas texto no terminal.

---

## Princípios Fundamentais

### 1. Escolhas Intencionais, Não Direcionais

O jogador deve pensar **"o que quero fazer?"**, não "pra qual direção ir?".

```
❌ Ruim (direcional):
  Saídas: Norte, Sul, Leste
  > norte

✅ Bom (intencional):
  Uma escadaria espiral desce para a escuridão.
  O ar frio carrega cheiro de ferrugem.
  Ao fundo, água pinga em ritmo irregular.

  O que você faz?
  > Descer a escadaria
  > Vasculhar a sala antes de sair
  > Seguir o som da água
  > Voltar pelo corredor
```

**Regra:** Cada escolha conta uma micro-história. As saídas são descritas **diegeticamente**.

### 2. Três Camadas de Exploração

| Camada    | Escopo                  | Exemplo                                    | Entidade            |
| --------- | ----------------------- | ------------------------------------------ | ------------------- |
| **Macro** | Regiões/biomas          | "Outskirts", "Lower City", "Throne Room"   | `RegionEntity`      |
| **Meso**  | Locais dentro da região | "Sala com poço", "Corredor de estátuas"    | `LocationEntity`    |
| **Micro** | Ações dentro do local   | Vasculhar, ouvir, descansar, ler inscrição | ações via Ink knots |

O jogador **sempre sabe onde está** (região + local) e **o que pode fazer** (ações contextuais).

### 3. Texto como Mapa

Em terminal, ASCII art de mapa **sempre decepciona**. O texto **é** o mapa.

- Descrição atmosférica do local atual
- Pistas sobre conexões embutidas na narrativa
- Sem grade visual, sem minimapa
- Stats sempre visíveis no rodapé (HP, Energia, Alma, Andar)

---

## Arquitetura

### Estrutura de Pastas

```
engine/exploration/
├── domain/
│   ├── region.entity.ts          # Macro: nome, descrição, dificuldade
│   ├── location.entity.ts        # Meso: conexões, eventos possíveis, tags
│   └── connection.type.ts        # Como locais se ligam (direcional/bi-direcional)
├── application/
│   ├── region-manager.service.ts       # Transições entre regiões
│   ├── location-explorer.service.ts    # Ações disponíveis e resolução no local atual
│   └── connection-finder.util.ts       # Quais caminhos existem a partir de um local
```

### Fluxo no Game Screen

```ts
// 1. Jogador chega num local
const description = location.describe(hero);

// 2. Renderiza texto + ações disponíveis
const actions = explorer.getAvailableActions(location, hero);

// 3. Jogador escolhe → resolve → pode gerar combate/loot/narrativa
const result = explorer.resolveAction(action, location, hero);

// 4. Se combate → transiciona pra combat.screen
// 5. Se narrativa → usa storyEngine + Ink
// 6. Se movimento → transiciona para próximo local
```

### Integração com Narrative Engine

**Exploração e narrativa são o mesmo sistema.** Cada local é um **knot no Ink** com tags:

```ink
=== damp_chamber ===
Uma poça de água estagnada reflete a luz fraca
de um cogumelo bioluminescente.

* [Seguir pelo túnel úmido] -> fungal_tunnel
* [Subir as escadas de pedra] -> stone_stairs
* [Examinar a poça] -> examine_pool
* [Descansar um momento] -> rest_here

= examine_pool
Algo brilha no fundo. Uma moeda? Um osso?
# loot:ashborne_coin:1
-> damp_chamber

= rest_here
~ hp = hp + 10
O silêncio é quase reconfortante. Quase.
-> damp_chamber
```

- O `StoryEngine` renderiza o texto
- As escolhas viram `AsciiMenu`
- Tags (`# loot`, `# combate`) disparam lógica TypeScript
- External functions permitem que Ink chame serviços do jogo

---

## Sensação de Liberdade — Técnicas

### Ações que Falham de Forma Interessante

Não existe "essa ação não existe". Tudo tem resposta, mesmo que seja puramente narrativa:

```
> Vasculhar a parede
Você passa os dedos pela pedra. Nada além de musgo e rachaduras.
...mas o musgo brilha fracamente. Interessante.
```

### Grafo Não-Linear com Ciclos e Atalhos

```
Sala A → Sala B → Sala C
  ↑                  ↓
  └──── Atalho ←─────┘
```

- Locais podem ter **múltiplos caminhos** entre si
- Atalhos descobertos dão sensação de **domínio sobre o ambiente**
- Regiões diferentes podem se conectar (não apenas progresso linear)

### Estado Persistente do Ambiente

| Ação do Jogador         | Efeito no Mundo                    |
| ----------------------- | ---------------------------------- |
| Matou inimigo na Sala X | Na próxima visita, sala está vazia |
| Pegou item              | Item não retorna                   |
| Derrubou porta          | Porta permanece destrancada        |
| Acionou armadilha       | Armadilha não rearma               |

Isso faz o mundo parecer **real e reativo**, não um loop.

### Escolhas que Mudam o Mapa

Ações têm consequências no ambiente, não só no inventário:

```
> Derrubar a porta com força
A porta estilhaça. O barulho ecoa — algo se mexeu lá embaixo.
# tag: combate (inimigo alerta)
```

---

## UI no Terminal — Layout

```
┌─ Ashborne — Outskirts ──────────────────────────┐
│                                                 │
│  Uma poça de água estagnada reflete a luz       │
│  fraca de um cogumelo bioluminescente.          │
│  Três passagens saem daqui:                     │
│                                                 │
│  > Seguir pelo túnel úmido                      │
│    Subir as escadas de pedra                    │
│    Examinar a poça                              │
│    Descansar um momento                         │
│                                                 │
├─────────────────────────────────────────────────┤
│  HP: [████████░░] 80/100   E: [███░░░] 3/5     │
│  Alma: 12              Andar: 1                │
└─────────────────────────────────────────────────┘
```

### Regras de UI

- **Stats sempre visíveis** (rodapé): HP, Energia, Alma, Andar/Região
- **Escolhas via menu ASCII** com `j/k` + `Enter`
- **Sem mapa visual** — o texto é o mapa
- **Sem "árvore de diálogo" visual** — apenas texto + escolhas atuais

---

## Implicações no Roadmap

### Fase 8 — Dungeon Generator (adaptada)

Em vez de gerar salas geometricamente conectadas, gerar um **grafo narrativo**:

1. `RegionEntity` com dificuldade e descrição
2. `LocationEntity` com conexões semânticas (não coordenadas)
3. Cada location aponta para um **knot Ink** que descreve o local
4. Conexões podem ser **descobertas** (ocultas inicialmente)

### Fase 9 — Game Loop

O loop se torna:

```
chegar no local → ler descrição → escolher ação → resolver ação
    ↓
  combate? → sim → tela combate → volta ao local (ou morre)
    ↓
  loot? → sim → aplica reward → volta ao local
    ↓
  narrativa? → sim → storyEngine → escolhas narrativas
    ↓
  movimento? → sim → próximo local → repete
```

### Fase 12 — Polishing

- Transições suaves entre locais (descrição de viagem)
- Sons de ambiente via texto ("o eco demora mais que o esperado")
- Descrições que mudam com o estado do jogador (HP baixo, cansado, envenenado)

---

## Resumo de Decisões

| Decisão                                 | Racional                                                 |
| --------------------------------------- | -------------------------------------------------------- |
| Escolhas intencionais sobre direcionais | Jogador pensa em ações, não em coordenadas               |
| Texto como mapa                         | ASCII art de mapa sempre decepciona                      |
| Exploração = narrativa                  | Mesmo sistema (Ink) cuida de ambos, menos complexidade   |
| Grafo com ciclos                        | Sensação de mundo real, não corredor linear              |
| Estado persistente                      | Mundo reage às ações do jogador                          |
| Nenhuma ação falha silenciosamente      | Sempre há resposta narrativa, mesmo para ações "erradas" |
| Stats sempre visíveis                   | Jogador nunca perde contexto de seu estado               |

---

## Referências Cruzadas

- `architecture.md` — Estrutura `engine/exploration/`
- `storytelling.md` — Integração Ink + inkjs, tags, external functions
- `CONVENTIONS.md` — Naming, testes, estilo de código
- `roadmap.md` — Fase 8 (Dungeon Generator), Fase 9 (Game Loop)
