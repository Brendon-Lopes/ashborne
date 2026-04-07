# SYSTEMS.md — Especificação dos Sistemas do Jogo

Status: ✅ implementado | 🔧 parcial | ❌ não implementado

---

## 1. Sistema de Dados ✅

**Localização:** `src/infrastructure/dice/dice-roller.service.ts`

Implementa o modelo de dados D&D adaptado. Todas as funções são puras e aceitam
um `RngFn` opcional para testes determinísticos.

### Funções disponíveis

| Função                                      | Descrição                       |
| ------------------------------------------- | ------------------------------- |
| `rollDie(die, rng?)`                        | Rola um único dado              |
| `roll(die, count, modifier, rng?)`          | Rola N dados com modificador    |
| `rollWithAdvantage(die, modifier, rng?)`    | Rola duas vezes, pega maior     |
| `rollWithDisadvantage(die, modifier, rng?)` | Rola duas vezes, pega menor     |
| `abilityCheck(modifier, dc, rng?)`          | D20 contra Difficulty Class     |
| `formatRoll(result)`                        | Formata resultado para exibição |

### Tipos de dado suportados

`d4, d6, d8, d10, d12, d20, d100`

### Casos especiais

- **Critical (20 natural):** dano dobrado
- **Fumble (1 natural):** falha automática independente de modificador
- Modificadores negativos são suportados

---

## 2. Sistema de Status Effects ✅

**Localização:** `src/shared/entities/status-effect.entity.ts`

### Effects implementados

| Effect      | Comportamento por turno                    |
| ----------- | ------------------------------------------ |
| `poison`    | Dano = magnitude                           |
| `bleeding`  | Dano = ceil(magnitude / 2)                 |
| `burning`   | Dano = magnitude + 1                       |
| `stunned`   | Perde turno (sem dano)                     |
| `cursed`    | Sem dano — efeito a implementar no combate |
| `weakened`  | Reduz dano causado em 25%                  |
| `empowered` | A implementar — aumenta dano               |
| `protected` | A implementar — reduz dano recebido        |

### Stacking

Mesmo effect aplicado duas vezes: soma duração, pega maior magnitude.
Effects diferentes coexistem independentemente.

### Tick

Ocorre no final do turno do inimigo (após ação do inimigo, antes do turno do jogador).
Reduz duração em 1. Effects com duração 0 são removidos.

---

## 3. Sistema de Combate ✅

**Localização:** `src/engine/combat/application/combat.service.ts`

### Máquina de estados

```
initiative → player_turn ⟷ enemy_turn → victory | defeat
```

### Fluxo de um turno do jogador

1. Jogador seleciona `Action`
2. `resolveAction(state, action, rng)` executa
3. `action.execute(ctx)` retorna `ActionResult`
4. Dano/cura aplicados ao novo estado
5. Log atualizado
6. Fase muda para `enemy_turn` (ou `victory` se inimigo morreu)

### Fluxo de um turno do inimigo

1. Game layer seleciona ação do inimigo (AI behavior a implementar)
2. `resolveEnemyTurn(state, action, rng)` executa
3. Mesmo processo acima, invertido
4. **Tick de effects** acontece aqui (poison, bleeding, etc.)
5. Fase muda para `player_turn` (ou `defeat` se jogador morreu)
6. Turno incrementado

### Inimigo atordoado

Se inimigo tem `stunned`, perde o turno automaticamente.
Effects ainda são tickados normalmente.

---

## 4. Sistema de AI ✅

**Localização:** `src/game/systems/ai/`

### Providers disponíveis

| Provider            | Quando usar                        |
| ------------------- | ---------------------------------- |
| `OllamaProvider`    | Desenvolvimento e jogo local       |
| `AnthropicProvider` | Qualidade máxima (custo por token) |
| `OpenAIProvider`    | Alternativa cloud                  |
| `MockAIProvider`    | Testes unitários sempre            |

Configurado via `AI_PROVIDER` no `.env`. Troca sem alterar código.

### Pontos de geração narrativa (Narrator)

| Método                       | Tokens | Quando chamado                  |
| ---------------------------- | ------ | ------------------------------- |
| `generatePrologue()`         | ~150   | Início da run                   |
| `describeRoom()`             | ~80    | Entrada em nova sala            |
| `narrateCombatAction()`      | ~60    | Após ação de combate (opcional) |
| `narrateChoice()`            | ~100   | Após escolha em evento          |
| `generateBossLastWords()`    | ~100   | Morte de boss                   |
| `generateEpitaph()`          | ~80    | Game over                       |
| `generateVictoryNarration()` | ~120   | Vitória final                   |

**Total estimado por run:** ~700-900 tokens.

---

## 5. Sistema de Conteúdo ✅

**Localização:** `src/game/systems/content/content-loader.service.ts`

Carrega e valida todos os arquivos de `data/`. Falha em parse se YAML inválido.

### Métodos disponíveis

| Método                           | Retorno                                   |
| -------------------------------- | ----------------------------------------- |
| `loadEvents()`                   | `GameEvent[]`                             |
| `loadEvent(id)`                  | `GameEvent \| undefined`                  |
| `loadEnemies()`                  | `EnemyData[]`                             |
| `loadEnemiesForRegion(regionId)` | `EnemyData[]` filtrados por `regionRange` |
| `loadClasses()`                  | `ClassData[]`                             |
| `loadClass(id)`                  | `ClassData \| undefined`                  |
| `loadWorldLore()`                | `{ title, content, fragments }`           |
| `loadPromptTemplates()`          | `Record<string, string>`                  |

---

## 6. Sistema de UI ✅

**Localização:** `src/ui/components/`

### Componentes disponíveis

**`AsciiBorder`** — Container com borda ASCII

```tsx
<AsciiBorder title="Narrativa" padding={2}>
  <Text>conteúdo</Text>
</AsciiBorder>
```

**`PanelLine`** — Linha com bordas laterais, padding automático

```tsx
<PanelLine variant="rustic" width={50}>
  texto da linha
</PanelLine>
```

**`HpBar`** — Barra de vida estilo ASCII

```tsx
<HpBar current={30} max={50} width={20} label="HP" />
// HP [::::::::............] 30/50
```

**`Separator`** — Linha divisória

```tsx
<Separator width={50} char="-" color="gray" />
```

### Variantes de borda

| Variante  | Aparência |
| --------- | --------- |
| `rustic`  | `+=====+` |
| `rough`   | `*-----*` |
| `wave`    | `~~~~~`   |
| `slash`   | `/-----\` |
| `minimal` | `.-----'` |
| `double`  | `#=====#` |

---

## 7. Geração de Mundo ❌

**Localização:** `src/game/systems/world/world-generator.service.ts` (a criar)

### Princípio

O jogador atravessa **regiões de Ashborne** — não andares de dungeon.
A estrutura técnica é um grafo de nós, mas a apresentação é a de um mundo
real com lugares que existiam antes do jogador chegar e continuam existindo.
Locais fechados (Convento, Catacumbas) são exceção intencional para criar
contraste claustrofóbico com o espaço aberto das demais regiões.

### As seis regiões

| #   | ID               | Nome            | Tipo de espaço                          |
| --- | ---------------- | --------------- | --------------------------------------- |
| 1   | `outskirts`      | Os Arredores    | Aberto — campos, estrada                |
| 2   | `lower_city`     | A Cidade Baixa  | Aberto — ruas, praças                   |
| 3   | `convent`        | O Convento      | **Fechado** — interior claustrofóbico   |
| 4   | `catacombs`      | As Catacumbas   | **Fechado** — subterrâneo               |
| 5   | `upper_district` | O Distrito Alto | Aberto — avenidas, mansões              |
| 6   | `the_center`     | O Centro        | Indefinível — geometria que não obedece |

### Estrutura de uma região

Cada região tem 6-9 **pontos de interesse** num grafo com múltiplos caminhos.
Um ponto de entrada e um ponto de boss são obrigatórios.

```
Mínimo por região:
- 1 entrada
- 2-3 combates
- 1-2 eventos
- 1 descanso
- 1 boss
- 1 loja (60% de chance)
```

### Geração por seed

Mesma seed = mesma disposição de pontos. Permite debug e runs especiais.
O seed inicializa o RNG que decide posições, tipos e conteúdo dos pontos.

### Progressão de dificuldade

| Região          | Inimigos                    | Tom                      |
| --------------- | --------------------------- | ------------------------ |
| Os Arredores    | Fracos, sem effects         | Estranheza leve          |
| A Cidade Baixa  | Médios, 1 effect            | Abandono perturbador     |
| O Convento      | Boss 1 + elites             | Claustrofobia            |
| As Catacumbas   | Difíceis, 2 effects         | Horror crescente         |
| O Distrito Alto | Elites, mecânicas especiais | Grandiosidade corrompida |
| O Centro        | Boss final, fases múltiplas | Geometria impossível     |

### Estrutura de dados

```typescript
interface RegionNode {
  id: string;
  regionId: RegionId; // 'outskirts' | 'lower_city' | etc.
  regionName: string; // nome exibido ao jogador
  isEnclosed: boolean; // true = Convento/Catacumbas — muda tom visual
  nodes: PointOfInterest[];
  entranceId: string;
  bossRoomId: string;
}

interface PointOfInterest {
  id: string;
  type: PointType;
  locationName: string; // "A Estrada Velha", "O Poço Seco"
  locationDescription: string; // descrição curta do lugar — passada ao Narrator
  contentId: string; // id do evento/inimigo em data/
  visited: boolean;
  connections: string[];
  position: { x: number; y: number };
}
```

### Renderização do mapa

Pontos e traços em vez de boxes — esboço topográfico, não planta baixa:

```
+======[ Os Arredores ]======+
|                            |
|  estrada . . . fazenda     |
|      \           /         |
|   poço seco . encruz.      |
|               \            |
|            [ portão ]      |
|                            |
| . visitado  ? desconhecido |
+============================+
```

Pontos visitados: nome completo.
Pontos não visitados: `?` ou nome parcial — o jogador sabe que há algo, não o quê.
Boss sempre visível e identificado como destino.

### Transições entre pontos

A IA narra o deslocamento entre pontos com base na região e nos locais:

```typescript
// Narrator recebe contexto do deslocamento
narrator.describeTransition(fromLocation, toLocation, regionId, moralScore);
```

O texto descreve o trajeto — não "você entra na próxima sala" mas:

> _Você segue pela estrada velha até o que foi um mercado..._

---

## 8. Sistema de Personagem ❌

**Localização:** `src/game/systems/character/character.service.ts` (a criar)

### Criação de personagem — fluxo de telas

A criação é composta por três telas sequenciais. Sem distribuição manual
de pontos. A classe define todos os atributos iniciais.

```
CharacterCreationFlow:
  1. ClassSelectScreen  → jogador escolhe classe (1/2/3)
  2. NameScreen         → jogador digita nome (ou ENTER para aleatório)
  3. ConfirmScreen      → exibe atributos, habilidades → confirma
     └── Narrator.generatePrologue() → jogo começa
```

### Atributos — os seis D&D

| Atributo     | Abrev. | Afeta mecanicamente              | Afeta narrativamente                |
| ------------ | ------ | -------------------------------- | ----------------------------------- |
| Força        | FOR    | Dano corpo a corpo               | —                                   |
| Destreza     | DEX    | Dano à distância, iniciativa     | —                                   |
| Constituição | CON    | HP máximo, resistência a effects | —                                   |
| Inteligência | INT    | Poder mágico, slots de feitiço   | —                                   |
| Sabedoria    | SAB    | Percepção, saves vs. effects     | Resistência à Força da Entidade     |
| Carisma      | CAR    | —                                | Respostas de NPCs, ramificações Ink |

**SAB** é o atributo narrativamente mais importante — nunca explicado ao jogador.
Jogadores com SAB alta percebem anomalias antes, têm opções extras em diálogos Ink,
e resistem melhor aos "empurrões" da Força nos eventos.

### Modifier (D&D padrão)

```typescript
const modifier = (value: number): number => Math.floor((value - 10) / 2);
// FOR 14 → +2 | INT 8 → -1 | DEX 16 → +3
```

### Atributos iniciais por classe

| Atributo            | Guerreiro | Mago    | Arqueiro |
| ------------------- | --------- | ------- | -------- |
| FOR                 | 14 (+2)   | 8 (-1)  | 10 (+0)  |
| DEX                 | 10 (+0)   | 10 (+0) | 16 (+3)  |
| CON                 | 14 (+2)   | 8 (-1)  | 12 (+1)  |
| INT                 | 8 (-1)    | 16 (+3) | 8 (-1)   |
| SAB                 | 10 (+0)   | 12 (+1) | 12 (+1)  |
| CAR                 | 8 (-1)    | 10 (+0) | 10 (+0)  |
| **HP inicial**      | **50**    | **35**  | **45**   |
| **Energia inicial** | **5**     | **8**   | **6**    |

### Derivados calculados

```typescript
interface DerivedStats {
  maxHp: number; // base + CON modifier * 5
  maxEnergy: number; // definido pela classe
  initiative: number; // DEX modifier (usado em combate)
  carryWeight: number; // FOR modifier * 2 (slots de inventário)
}
```

### Progressão de atributos — level up

- XP ganho em combates e eventos
- Level up ao atingir threshold (100 XP × nível atual)
- Ao subir de nível: **escolha de +3 num atributo** (só isso — simples)
- HP máximo sobe automaticamente: Guerreiro +8, Arqueiro +6, Mago +4 por nível
- Nível máximo por run: 6 (um por região)

```
Nível 2: escolha +3 em FOR, CON ou DEX (Guerreiro)
Nível 3: escolha +3 em qualquer atributo
```

### Habilidades por classe

Cada classe tem 4 habilidades fixas: 3 ativas + 1 passiva.
Não há escolha de habilidade — a identidade da classe é definida.

**Guerreiro:**

- Golpe Pesado (2 EN) — d8+FOR, chance de atordoar (d20 vs CON inimigo)
- Postura Defensiva (1 EN) — próximo dano recebido reduzido em 50%
- Grito de Guerra (3 EN) — +2 dano por 3 turnos
- Resiliência (passiva) — regenera 3 HP/turno quando HP < 25%

**Mago:**

- Chama Cinzenta (3 EN) — d10+INT, aplica burning(2t, mag.3)
- Véu de Névoa (2 EN) — próximo ataque tem 50% de chance de errar
- Drenagem (4 EN) — d6+INT dano, recupera metade como HP
- Eco Arcano (passiva) — a cada 3 feitiços, o próximo custa 0 EN

**Arqueiro:**

- Flecha Perfurante (2 EN) — d6+DEX, ignora 2 de armadura
- Flecha Envenenada (3 EN) — d4+DEX, aplica poison(3t, mag.4)
- Recuar (1 EN) — próximo dano recebido -3
- Olho Afiado (passiva) — primeiro ataque de cada combate tem vantagem

### Interface da tela de confirmação

```
+===============[ ASHBORNE ]================+
|                                           |
|  ALDRIC  —  Guerreiro                     |
|                                           |
+-------------------------------------------+
|  ATRIBUTOS             DERIVADOS          |
|                                           |
|  FOR  14  +2           HP       50        |
|  DEX  10  +0           Energia   5        |
|  CON  14  +2           Gold      0        |
|  INT   8  -1           Moral     0        |
|  SAB  10  +0                              |
|  CAR   8  -1                              |
|                                           |
+-------------------------------------------+
|  HABILIDADES INICIAIS                     |
|                                           |
|  [A] Golpe Pesado     2 EN  d8+FOR        |
|  [B] Postura Def.     1 EN  -50% dano     |
|  [C] Grito de Guerra  3 EN  +2 dano/3t    |
|  [P] Resiliência      passiva             |
|                                           |
+-------------------------------------------+
|  [1] Começar jornada   [2] Voltar         |
+-------------------------------------------+
```

### Tela de level up

```
+===============[ ASHBORNE ]================+
|                                           |
|           * NÍVEL 2 *                     |
|                                           |
|  Aldric carrega mais do que antes.        |
|  Não sabe se é força ou peso acumulado.   |
|                                           |
+-------------------------------------------+
|  HP máximo: 50 → 58                       |
|                                           |
|  Escolha um atributo (+3):                |
|                                           |
|  [1] FOR 14 → 17  (mais dano)             |
|  [2] CON 14 → 17  (mais HP no próx. nível)|
|  [3] DES 10 → 13  (mais precisão)         |
+-------------------------------------------+
| > _                                       |
+-------------------------------------------+
```

### Estrutura de dados

```typescript
interface Character extends CombatEntity {
  class: CharacterClass; // 'warrior' | 'mage' | 'archer'
  name: string;
  level: number; // 1-6
  xp: number;
  xpToNextLevel: number; // nivel * 100
  energy: number;
  maxEnergy: number;
  gold: number;
  inventory: Item[];
  equippedActions: Action[]; // 3 ativas
  passiveAction: Action; // 1 passiva
  relics: Relic[];
}
```

---

## 9. Sistema de Eventos ❌

**Localização:** `src/game/systems/events/event-runner.service.ts` (a criar)

### Fluxo

1. Carregar evento pelo `contentId` do ponto de interesse
2. Exibir contexto + escolhas
3. Jogador seleciona opção (número ou texto)
4. Aplicar `moralWeight` ao `RunState.moralScore`
5. Aplicar recompensas (gold, xp, item, lore fragment)
6. Chamar `Narrator.narrateChoice()` para texto de consequência
7. Desbloquear fragmento de lore se `reward.loreFragment` definido

### Sistema moral

- `moralScore` acumula durante a run (-∞ a +∞ na prática, tipicamente -10 a +10)
- Afeta tom das descrições do Narrator
- Afeta diálogos de NPCs (a implementar)
- Pode fechar/abrir caminhos em eventos futuros
- **Não há alinhamento bom/mau explícito** — apenas peso narrativo

---

## 10. Meta-progressão ❌

**Localização:** `src/game/systems/meta/meta-progression.service.ts` (a criar)

### Dados persistidos

```typescript
MetaProgress {
  totalRuns: number
  unlockedClasses: CharacterClass[]
  loreFragments: LoreFragment[]      // fragmentos coletados
  permanentBonuses: Partial<Attributes>  // pequenos bônus permanentes
  deadHeroes: DeadHero[]             // epitáfios e relics deixados
}
```

### Desbloqueios

- **Guerreiro:** disponível desde o início
- **Mago:** desbloqueia após 3 runs
- **Arqueiro:** desbloqueia após completar um evento específico
- Novas classes (V2+): desbloqueiam por marcos de lore

### Fragmentos de lore

- Coletados em eventos (`reward.loreFragment`)
- Acessíveis no Arquivo (menu entre runs)
- Revelam a narrativa completa gradualmente
- A ordem de revelação é intencional — ver `STORY.md`

### Relics de heróis mortos

- Ao morrer, herói pode deixar uma relic com lore gerado pelo epitáfio
- Relic aparece em run futura como item especial em sala específica
- Nome e descrição fazem referência ao herói anterior

---

## 11. Sistema de I18n ❌

**Localização:** `src/game/systems/i18n/i18n.service.ts` (a criar)

**Prioridade:** Implementar antes de qualquer tela — refatorar depois é custoso.

### Responsabilidades

- Carregar `data/i18n/{locale}.json` com strings de UI
- Resolver campos multilíngues de conteúdo YAML `{ pt: "...", en: "..." }`
- Fornecer o locale ativo ao `Narrator` para geração no idioma correto
- Fallback para `pt` se chave não existir no locale solicitado

### Interface esperada

```typescript
class I18nService {
  constructor(locale: string, strings: Record<string, unknown>) {}

  // Resolve chave pontilhada: i18n.t('ui.hp') → "HP"
  t(key: string): string;

  // Resolve campo multilíngue de YAML
  tContent(obj: Record<string, string>): string;

  get locale(): string;
}
```

### Estrutura de `data/i18n/pt.json`

```json
{
  "ui": {
    "hp": "HP",
    "energy": "Energia",
    "turn": "Turno",
    "region": "Região",
    "inventory": "Inventário",
    "archive": "O Arquivo"
  },
  "combat": {
    "victory": "Vitória",
    "defeat": "Derrota",
    "enemy_intent": "Intenção do inimigo",
    "your_turn": "Seu turno",
    "enemy_turn": "Turno do inimigo"
  },
  "menus": {
    "new_run": "Nova Jornada",
    "continue": "Continuar",
    "quit": "Sair",
    "select_class": "Escolha sua classe"
  },
  "narrator_tone": "Você é o narrador de Ashborne..."
}
```

### Conteúdo YAML multilíngue

Todos os campos de texto visível ao jogador usam objeto com locale como chave:

```yaml
title:
  pt: A Vila Amaldiçoada
  en: The Cursed Village
context:
  pt: |
    Uma vila silenciosa...
  en: |
    A silent village...
```

### Integração com Narrator

O `Narrator` recebe o locale e seleciona o prompt de tom correto:

```typescript
const WORLD_TONE: Record<string, string> = {
  pt: 'Você é o narrador de Ashborne...',
  en: 'You are the narrator of Ashborne...',
};
```

A IA responde no idioma do prompt — sem tradução adicional necessária.

### Configuração

```env
GAME_LOCALE=pt   # pt (padrão) | en
```

### Idiomas planejados

- `pt` — português brasileiro (idioma padrão, sempre criado primeiro)
- `en` — inglês (segunda prioridade)
- Outros idiomas adicionados conforme necessidade, sem alterar código

---

## 12. Áudio ❌

**Localização:** `src/game/audio/audio-player.service.ts` (a criar)

### Faixas planejadas

| Faixa         | Quando toca                        |
| ------------- | ---------------------------------- |
| `menu.ogg`    | Menu principal e seleção de classe |
| `dungeon.ogg` | Exploração de regiões              |
| `combat.ogg`  | Combate comum                      |
| `boss.ogg`    | Boss fight                         |
| `death.ogg`   | Game over                          |
| `victory.ogg` | Vitória de região                  |

### Implementação

Usar `play-sound` (já nas dependências) para reprodução simples.
Fade entre faixas com timeout manual.
Música é opcional — falha silenciosa se arquivo não encontrado.

---

## 13. Sistema Narrativo (Ink) ❌

**Localização:** `src/game/systems/narrative/narrative-system.service.ts` (a criar)

### Responsabilidades

- Compilar e carregar `data/narrative/main.ink` via `inkjs`
- Sincronizar flags do `RunState` com variáveis Ink antes de cada cena
- Verificar triggers por localização e estado do jogo
- Avançar a story Ink e processar tags de output
- Sincronizar variáveis Ink de volta ao `RunState` após cada cena
- Chamar `Narrator.enrichLine()` para linhas com tag `AI_HINT`

### Interface esperada

```typescript
class NarrativeSystemService {
  load(): Promise<void>;
  checkTrigger(locationId: string, state: RunState): string | null;
  runScene(knotId: string, state: RunState): Promise<NarrativeScene>;
  choose(choiceIndex: number, state: RunState): Promise<NarrativeScene>;
  syncToRunState(state: RunState): RunState;
}

interface NarrativeScene {
  lines: NarrativeLine[];
  choices: string[];
  isEnd: boolean;
}

interface NarrativeLine {
  text: string;
  enriched?: string; // gerado pela IA quando AI_HINT presente
  tags: string[];
}
```

### Variáveis Ink globais (espelham RunState)

| Variável Ink      | RunState                     | Tipo   |
| ----------------- | ---------------------------- | ------ |
| `moral_score`     | `state.moralScore`           | number |
| `fragments_found` | `state.loreFragments.length` | number |
| `oracle_met`      | `state.flags.oracleMet`      | bool   |
| `oracle_trust`    | `state.flags.oracleTrust`    | number |
| `brennan_seen`    | `state.flags.brennanSeen`    | number |
| `diogenes_seen`   | `state.flags.diogenesSeen`   | number |
| `last_event`      | `state.lastEventType`        | string |
| `runs_total`      | `meta.totalRuns`             | number |

### Triggers — quando cada cena dispara

| Knot                   | Trigger                         | Condição adicional     |
| ---------------------- | ------------------------------- | ---------------------- |
| `oracle_first_meeting` | `location: region_2_entrance`   | `oracle_met == false`  |
| `oracle_knowing`       | `location: region_4_entrance`   | `fragments_found >= 4` |
| `oracle_confronted`    | `location: region_5_entrance`   | `fragments_found >= 7` |
| `diogenes_encounter`   | Entre pontos, 1x por região     | aleatório              |
| `brennan_first`        | `location: outskirts_gate`      | `brennan_seen == 0`    |
| `brennan_second`       | `location: upper_district_gate` | `brennan_seen == 1`    |
| `brennan_third`        | `location: center_entrance`     | `brennan_seen == 2`    |
| `dream_sequence`       | `roomType: rest`                | sempre                 |
| `villain_first`        | `location: convent_interior`    | primeira vez           |

### Tags Ink disponíveis

| Tag          | Exemplo                                    | Efeito               |
| ------------ | ------------------------------------------ | -------------------- |
| `AI_HINT`    | `# AI_HINT: oracle shadow, eerie`          | IA enriquece a linha |
| `GAME_EVENT` | `# GAME_EVENT: give_item seal_of_passage`  | Dispara evento       |
| `GAME_EVENT` | `# GAME_EVENT: unlock_fragment cycle_02`   | Desbloqueia lore     |
| `GAME_EVENT` | `# GAME_EVENT: set_flag oracle_confronted` | Seta flag            |
| `GAME_EVENT` | `# GAME_EVENT: moral_change -1`            | Altera moral score   |

### Arquivos Ink e seus conteúdos

| Arquivo          | Conteúdo                                |
| ---------------- | --------------------------------------- |
| `main.ink`       | INCLUDE de todos, variáveis globais     |
| `oracle.ink`     | Três fases de encontros com a Oráculo   |
| `diogenes.ink`   | Encontros por região e estado da run    |
| `brennan.ink`    | Três encontros + puzzle de regras       |
| `morrigan.ink`   | Conversas na "taberna" sem paredes      |
| `voss_twins.ink` | Diálogos das gêmeas                     |
| `villain.ink`    | Encontros com o vilão que se perde      |
| `dreams.ink`     | Contexto para geração de sonhos pela IA |

### Sonhos — integração especial

O `dreams.ink` define o contexto do sonho. A IA gera o texto via
`Narrator.generateDream()`. O Ink nunca descreve o sonho — só fornece contexto.

```ink
=== dream_sequence ===
# AI_HINT: dream, moral:{moral_score}, fragments:{fragments_found}
Você fecha os olhos.
-> END
```

### Separação de responsabilidades

- **Ink** decide o que acontece narrativamente e quando
- **RunState** decide o estado mecânico
- **NarrativeSystem** é a ponte entre os dois
- **IA** enriquece linhas com `AI_HINT` — texto base sempre funciona sem ela

---

## 14. Input Livre do Jogador ❌

**Localização:** `src/game/systems/input/free-input.service.ts` (a criar)

### Princípio fundamental

O texto do jogador **nunca entra diretamente no prompt da IA**.
Apenas a intenção classificada é passada. Isso previne saída de contexto,
prompt injection e quebra de personagem.

### Fluxo em duas etapas

```
Jogador digita texto livre
        ↓
Etapa 1: classificação local (sem IA, sem custo)
  → dicionário de padrões por NPC
  → mapeia para intent: { type, target }
        ↓
Etapa 2: Ink decide o knot baseado na intent
  → checkTrigger(intent, npcId)
        ↓
Etapa 3: IA gera resposta com prompt controlado
  → nunca usa o texto original do jogador
  → apenas a intent classificada
```

### Classificação de intenções

```typescript
const INTENT_PATTERNS: Record<string, IntentPattern[]> = {
  oracle: [
    { pattern: /identidade|quem.*você|primeira.*heroína/i, intent: 'accusation_identity' },
    { pattern: /ciclo|loop|repetição/i, intent: 'question_cycle' },
    { pattern: /ajuda|guiar|caminho/i, intent: 'request_guidance' },
    { pattern: /mentira|traição|sabotagem/i, intent: 'accusation_betrayal' },
  ],
  diogenes: [
    { pattern: /cachorro|animal|fala/i, intent: 'question_nature' },
    { pattern: /ciclo|mundo|verdade/i, intent: 'question_world' },
    { pattern: /ajuda|conselho/i, intent: 'request_help' },
  ],
  brennan: [
    { pattern: /regra|artigo|manual/i, intent: 'question_rules' },
    { pattern: /portão|muro|parede/i, intent: 'question_gate' },
    { pattern: /passar|atravessar/i, intent: 'request_passage' },
  ],
};

const DEFAULT_INTENT = 'unknown'; // fallback: resposta genérica do NPC via Ink
```

### Guard rails no prompt da IA

```typescript
const PROTECTED_SECRETS = [
  'oracle_is_first_hero',
  'cycle_feeds_on_heroes',
  'meta_progression_is_the_trap',
  'secret_ending_exists',
];

const buildResponsePrompt = (npc: NPC, intent: string): string => `
Você é ${npc.name} em Ashborne. Responda APENAS como esse personagem.
Máximo 3 frases. NUNCA confirmar ou negar: ${PROTECTED_SECRETS.join(', ')}.
NUNCA sair do personagem. NUNCA mencionar IA, jogo ou sistema.
Responda à intenção "${intent}".
`;
```

### Quando o input livre aparece

| Situação                         | Disponível | Razão                         |
| -------------------------------- | ---------- | ----------------------------- |
| Conversa com NPC recorrente      | ✅         | Personagem estabelecido       |
| Durante evento de escolha        | ❌         | Escolhas fixas têm prioridade |
| Combate                          | ❌         | Contexto mecânico             |
| Primeiro encontro (antes do Ink) | ❌         | Apresentação via Ink primeiro |
| Sonhos                           | ❌         | Unidirecional                 |

### UX — coexistência com escolhas fixas

```
+====[ Diógenes ]====+
| "Você também."     |
+====================+

 [1] Perguntar sobre o ciclo
 [2] Perguntar sua natureza
 [3] Ir embora

 Ou escreva: > _
```

Escolhas fixas têm prioridade visual. Input livre é secundário.
Respostas geradas via input livre têm cor levemente diferente —
indica que é resposta improvisada, não diálogo roteirizado.
