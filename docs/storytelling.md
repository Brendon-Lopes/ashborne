# Storytelling — Decisões de Design

## Stack

| Camada           | Tecnologia           | Função                                   |
| ---------------- | -------------------- | ---------------------------------------- |
| **Autoria**      | Ink (Inkle) — `.ink` | Escrever narrativa ramificada            |
| **Editor**       | Inky                 | IDE visual com preview em tempo real     |
| **Compilação**   | `inklecate` → JSON   | Compila `.ink` em `.json`                |
| **Runtime**      | `inkjs` (npm)        | Executa o JSON no Node.js                |
| **Renderização** | Ink (React terminal) | Renderiza texto + escolhas com ASCII art |

> **Ink (Inkle)** = linguagem de narrativa interativa
> **Ink (React)** = renderização no terminal
> São projetos diferentes que usamos juntos.

---

## Fluxo de Trabalho

```
historia.ink  ──[inklecate]──►  historia.json  ──[inkjs]──►  texto + escolhas
                                                                    │
                                                          Ink (React UI)
                                                                    │
                                                          jogador escolhe
                                                                    │
                                                          inkjs.ChooseChoiceIndex()
                                                                    │
                                                          continua narrativa
```

### Exemplo `.ink`

```ink
VAR hp = 100
VAR alma = 0

=== inicio ===
Você acorda em uma masmorra escura.
# combate
O que você faz?

* [Explorar a sala] -> explorar
* [Descansar] -> descansar

= explorar
Você encontra um goblin!
# tag: combate
-> combate_goblin

= descansar
Você recupera 10 HP.
~ hp = hp + 10
-> inicio

=== combate_goblin ===
Um goblin bloqueia seu caminho!
* [Atacar] -> atacar_goblin
* [Fugir] -> inicio

= atacar_goblin
{RANDOM(1,20)} no dado!
-> END
```

---

## Estado do Jogo

### O que fica no Ink

Variáveis **narrativas** — HP, alma, flags de história, inventário leve:

```ink
VAR hp = 100
VAR alma = 0
VAR tem_chave = false
VAR sala_visitada = 0
```

Acessíveis via `story.variablesState["hp"]`.

### O que fica fora do Ink

Dados de **meta-progressão** e **infraestrutura**:

| Dado                      | Onde                               | Por quê              |
| ------------------------- | ---------------------------------- | -------------------- |
| Almas totais (acumuladas) | JSON em `~/.ashborne/profile.json` | Persiste entre runs  |
| Classes desbloqueadas     | JSON em `~/.ashborne/profile.json` | Meta-progressão      |
| Seed da run atual         | Variável TS                        | Geração procedural   |
| Estado da dungeon         | Entidade TS (`DungeonEntity`)      | Lógica de exploração |
| Save/Load de run          | JSON em `~/.ashborne/saves/`       | Resume jogo          |

### Por que não um DB local?

- **SQLite é overkill** — o jogo é single-player, um save por vez
- **JSON é suficiente** — serialização nativa do inkjs + dados simples
- **YAML é legível** mas exige parse extra — JSON é nativo no Node

### Estrutura de Save

```
~/.ashborne/
├── profile.json          # Meta-progressão (persistente)
└── saves/
    └── current-run.json  # Estado da run atual (inkjs state + dados TS)
```

**`profile.json`:**

```json
{
  "totalAlmas": 150,
  "unlockedClasses": ["warrior", "mage"],
  "unlocks": ["bonus_hp_1"],
  "runsCompleted": 3,
  "highScore": 500
}
```

**`current-run.json`:**

```json
{
  "inkState": "...",        // story.state.ToJson() do inkjs
  "dungeon": { ... },       // DungeonEntity serializada
  "hero": { ... },          // HeroEntity serializada
  "floor": 2,
  "seed": 12345
}
```

---

## Integração inkjs + Ink (React)

### Setup

```ts
// engine/narrative/application/story-engine.ts
import { Story } from 'inkjs';
import storyJson from '@config/historia.json';

export class StoryEngine {
  private story: Story;

  constructor() {
    this.story = new Story(JSON.stringify(storyJson));
  }

  continue(): string {
    return this.story.Continue();
  }

  continueMaximally(): string {
    return this.story.ContinueMaximally();
  }

  getChoices(): string[] {
    return this.story.currentChoices.map((c) => c.text);
  }

  chooseChoice(index: number): void {
    this.story.ChooseChoiceIndex(index);
  }

  get canContinue(): boolean {
    return this.story.canContinue;
  }

  getVariable(name: string): unknown {
    return this.story.variablesState[name];
  }

  setVariable(name: string, value: unknown): void {
    this.story.variablesState[name] = value;
  }

  saveState(): string {
    return this.story.state.ToJson();
  }

  loadState(json: string): void {
    this.story.state.LoadJson(json);
  }

  goToKnot(knot: string): void {
    this.story.ChoosePathString(knot);
  }
}
```

### UI com Ink (React)

```tsx
// ui/screens/story.screen.tsx
import { useInput, Text } from 'ink';
import { useState, useEffect } from 'react';
import { StoryEngine } from '@engine/narrative/application/story-engine';
import { AsciiBorder } from '@ui/components/ascii-border.component';
import { AsciiMenu } from '@ui/components/ascii-menu.component';

function StoryScreen({ storyEngine }: Props) {
  const [text, setText] = useState('');
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const content = storyEngine.continueMaximally();
    setText(content);
    setChoices(storyEngine.getChoices());
  }, []);

  useInput((input) => {
    if (input === 'j' || input === 'arrowdown') setSelected((s) => Math.min(choices.length - 1, s + 1));
    if (input === 'k' || input === 'arrowup') setSelected((s) => Math.max(0, s - 1));
    if (input === 'enter') {
      storyEngine.chooseChoice(selected);
      // Re-renderiza próximo bloco
      const content = storyEngine.continueMaximally();
      setText(content);
      setChoices(storyEngine.getChoices());
    }
  });

  return (
    <AsciiBorder title="Narrativa">
      {text}
      {choices.length > 0 && <AsciiMenu items={choices} selectedIndex={selected} />}
    </AsciiBorder>
  );
}
```

---

## External Functions (inkjs → TS)

O ink pode chamar funções TypeScript via `BindExternalFunction`:

```ink
~ RollDado(20)
~ AplicarDano(15)
```

```ts
// engine/narrative/application/story-engine.ts
this.story.BindExternalFunction('RollDado', (sides: number) => {
  return this.diceRoller.roll(`1d${sides}`);
});

this.story.BindExternalFunction('AplicarDano', (amount: number) => {
  this.hero.takeDamage(amount);
});
```

### Quando usar external functions

| Use               | Quando                                                 |
| ----------------- | ------------------------------------------------------ |
| External function | Chamada de lógica TS (combate, dado, inventário)       |
| Variável Ink      | Estado simples (HP, flags, contadores)                 |
| Tag (`# combate`) | Metadados para o TS reagir (ex: abrir tela de combate) |

---

## Tags como Gatilhos

Tags no ink disparam eventos no TS:

```ink
Um goblin aparece!
# combate:goblin:1
```

```ts
const tags = story.currentTags; // ['combate:goblin:1']
if (tags[0]?.startsWith('combate:')) {
  const [, enemy, level] = tags[0].split(':');
  // Abre tela de combate com goblin nível 1
}
```

### Convenção de Tags

| Tag     | Formato                   | Uso                 |
| ------- | ------------------------- | ------------------- |
| Combate | `# combate:inimigo:nível` | Iniciar combate     |
| Loot    | `# loot:item:quantidade`  | Dar item ao jogador |
| Trap    | `# trap:tipo:dano`        | Armar armadilha     |
| Shop    | `# shop`                  | Abrir mercador      |
| Boss    | `# boss:nome`             | Combate de chefe    |

---

## Compilação do `.ink`

### Desenvolvimento

```bash
# Instalar inklecate (binário)
# https://github.com/inkle/ink/releases

# Compilar
inklecate -o src/config/historia.json src/narrative/historia.ink

# Watch (recompilar ao salvar)
inklecate -w -o src/config/historia.json src/narrative/historia.ink
```

### CI/Build

```json
// package.json
{
  "scripts": {
    "build:ink": "inklecate -o src/config/historia.json src/narrative/historia.ink",
    "watch:ink": "inklecate -w -o src/config/historia.json src/narrative/historia.ink"
  }
}
```

---

## Regras

1. **Ink cuida da narrativa** — texto, escolhas, ramificações
2. **TS cuida do estado do jogo** — HP, combate, dungeon, inventário
3. **Tags conectam os dois** — ink emite, TS reage
4. **External functions** — ink chama lógica TS quando precisa
5. **Save do inkjs** — serializa estado completo da narrativa
6. **Save do TS** — serializa entidades + meta-progressão em JSON
