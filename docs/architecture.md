# Arquitetura — Ashborne v2

## Arquitetura Hexagonal + DDD Leve

O projeto segue **Arquitetura Hexagonal** com **Bounded Contexts** agrupados em `engine/`.
Cada contexto contém `domain/` (entidades, regras) e `application/` (casos de uso, serviços).
Dependências **sempre apontam para dentro** — o domínio não conhece nada externo.

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION (externo)                    │
│  ui/  (Ink + React)                                         │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 ENGINE (bounded contexts)              │  │
│  │  engine/combat/  ·  engine/exploration/  ·  ...        │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │            DOMAIN + SHARED KERNEL               │  │  │
│  │  │  shared/  (entities, enums, types, errors, ports)│  │  │
│  │  │  Regras de negócio puras — ZERO dependências     │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              INFRASTRUCTURE (adapters)                 │  │
│  │  infrastructure/  (dice, save, rng)                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Regra de Ouro

> **Nenhuma camada pode importar de uma camada mais externa.**
>
> - `shared/` → nunca importa nada
> - `engine/*/domain/` → importa apenas `shared/`
> - `engine/*/application/` → importa `engine/*/domain/` e `shared/`
> - `ui/` → importa `engine/*/application/` e `shared/`
> - `infrastructure/` → importa `shared/` (implementa ports)

---

## Estrutura de Pastas

```
src/
├── shared/                      # SHARED KERNEL — tipos comuns a todos os contextos
│   ├── entities/
│   │   ├── hero.entity.ts
│   │   ├── enemy.entity.ts
│   │   └── item.entity.ts
│   ├── enums/
│   │   ├── character-class.enum.ts
│   │   ├── item-type.enum.ts
│   │   └── damage-type.enum.ts
│   ├── types/
│   │   ├── dice.type.ts
│   │   └── position.type.ts
│   ├── errors/
│   │   ├── game.error.ts
│   │   └── combat.error.ts
│   └── ports/                   # Interfaces que infrastructure implementa
│       ├── dice-roller.port.ts
│       ├── renderer.port.ts
│       └── save-manager.port.ts
│
├── engine/                      # BOUNDED CONTEXTS — motor do jogo
│   ├── combat/                  # Combate
│   │   ├── domain/
│   │   │   ├── combatant.entity.ts
│   │   │   ├── combat-result.type.ts
│   │   │   └── combat.error.ts
│   │   └── application/
│   │       ├── combat.service.ts
│   │       └── damage.calculator.ts
│   │
│   ├── exploration/             # Exploração/Dungeon
│   │   ├── domain/
│   │   │   ├── dungeon.entity.ts
│   │   │   ├── room.entity.ts
│   │   │   └── tile-type.enum.ts
│   │   └── application/
│   │       ├── dungeon-generator.service.ts
│   │       └── room.factory.ts
│   │
│   ├── progression/             # Meta-progressão
│   │   ├── domain/
│   │   │   ├── player-profile.entity.ts
│   │   │   └── unlock.type.ts
│   │   └── application/
│   │       ├── meta-progression.service.ts
│   │       └── unlock-manager.ts
│   │
│   └── narrative/               # Narrativa/Eventos
│       ├── domain/
│       │   ├── story-graph.entity.ts
│       │   ├── story-node.entity.ts
│       │   └── choice.type.ts
│       └── application/
│           ├── choice-handler.ts
│           ├── event-pool.service.ts
│           └── events/
│               ├── combat.event.ts
│               ├── treasure.event.ts
│               ├── trap.event.ts
│               └── merchant.event.ts
│
├── infrastructure/              # INFRASTRUCTURE — adapters de IO e utilitários
│   ├── dice/
│   │   ├── dice-roller.service.ts
│   │   └── dice-notation.util.ts
│   ├── rng/
│   │   └── rng.util.ts
│   └── save/
│       └── save-file.adapter.ts
│
├── ui/                          # PRESENTATION — Ink + React
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ascii-border.component.tsx
│   │   ├── ascii-menu.component.tsx
│   │   ├── ascii-health-bar.component.tsx
│   │   ├── ascii-dialog.component.tsx
│   │   └── ascii-map.component.tsx
│   ├── screens/
│   │   ├── title.screen.tsx
│   │   ├── character-creation.screen.tsx
│   │   ├── game.screen.tsx
│   │   ├── combat.screen.tsx
│   │   ├── death.screen.tsx
│   │   └── meta-progression.screen.tsx
│   └── hooks/
│       └── use-game-input.hook.ts
│
├── config/                      # Configurações estáticas
│   ├── enemies.config.ts
│   ├── items.config.ts
│   ├── classes.config.ts
│   └── events.config.ts
│
├── utils/
│   └── format.util.ts
│
└── main.ts                      # Entry point + Composition Root
```

---

## Path Aliases

Imports usam **aliases** para evitar caminhos relativos longos:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["src/shared/*"],
      "@engine/*": ["src/engine/*"],
      "@infra/*": ["src/infrastructure/*"],
      "@ui/*": ["src/ui/*"],
      "@config/*": ["src/config/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### Exemplos

```ts
// ✅ Bom — alias curto e claro
import { DiceRollerPort } from '@shared/ports/dice-roller.port';
import { CombatService } from '@engine/combat/application/combat.service';
import { HeroEntity } from '@shared/entities/hero.entity';

// ❌ Ruim — relativo longo
import { CombatService } from '../../engine/combat/application/combat.service';
```

### Alias por contexto

```ts
// Dentro de engine/exploration/application/dungeon-generator.service.ts
import { DungeonEntity } from '@engine/exploration/domain/dungeon.entity';
import { DiceRollerPort } from '@shared/ports/dice-roller.port';
```

---

## Convenção de Nomes (Nest.js Style)

### Sufixos por tipo

| Tipo              | Sufixo           | Exemplo                        |
| ----------------- | ---------------- | ------------------------------ |
| Classe de domínio | `.entity.ts`     | `hero.entity.ts`               |
| Classe de serviço | `.service.ts`    | `dice-roller.service.ts`       |
| Classe de sistema | `.system.ts`     | `combat.system.ts`             |
| Interface/Port    | `.port.ts`       | `renderer.port.ts`             |
| Enum              | `.enum.ts`       | `character-class.enum.ts`      |
| Type alias        | `.type.ts`       | `combat-result.type.ts`        |
| Error             | `.error.ts`      | `game.error.ts`                |
| Util              | `.util.ts`       | `rng.util.ts`                  |
| Config            | `.config.ts`     | `enemies.config.ts`            |
| Factory           | `.factory.ts`    | `room.factory.ts`              |
| Adapter           | `.adapter.ts`    | `save-file.adapter.ts`         |
| Screen (UI)       | `.screen.tsx`    | `title.screen.tsx`             |
| Component (UI)    | `.component.tsx` | `ascii-menu.component.tsx`     |
| Hook (UI)         | `.hook.tsx`      | `use-game-input.hook.tsx`      |
| Event (narrativa) | `.event.ts`      | `combat.event.ts`              |

### Nome do arquivo

- **kebab-case** sempre: `dice-roller.service.ts`
- **Pasta espelha arquivo**: `combat/application/combat.service.ts`

---

## Injeção de Dependência

Sem `new` direto em classes de aplicação. Use **constructor injection**:

```ts
// ✅ Bom
export class CombatService {
  constructor(
    private readonly diceRoller: DiceRollerPort,
    private readonly damageCalculator: DamageCalculator,
  ) {}
}

// ❌ Ruim
export class CombatService {
  private diceRoller = new DiceRollerService();
}
```

### Composition Root

Todas as dependências são montadas no `main.ts`:

```ts
// main.ts
const rng = createRng(config.seed);
const diceRoller = new DiceRollerService(rng);
const damageCalc = new DamageCalculator();
const combat = new CombatService(diceRoller, damageCalc);
const game = <GameScreen combat={combat} />;
```

---

## Ports (Interfaces de Domínio)

Ports definem **contratos** que infrastructure implementa:

```ts
// shared/ports/dice-roller.port.ts
export interface DiceRollerPort {
  roll(notation: string): number;
  rollWithModifier(notation: string, modifier: number): number;
}

// infrastructure/dice/dice-roller.service.ts
export class DiceRollerService implements DiceRollerPort {
  roll(notation: string): number { /* ... */ }
  rollWithModifier(notation: string, modifier: number): number { /* ... */ }
}
```

---

## Entidades

Entidades são **classes puras** sem dependências externas:

```ts
// shared/entities/hero.entity.ts
export class HeroEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public hp: number,
    public maxHp: number,
    public attack: number,
    public defense: number,
    public level: number,
    public xp: number,
  ) {}

  isAlive(): boolean {
    return this.hp > 0;
  }

  takeDamage(amount: number): number {
    const actual = Math.max(0, amount - this.defense);
    this.hp = Math.max(0, this.hp - actual);
    return actual;
  }
}
```

---

## Serviços (Application)

Serviços **orquestram** entidades e ports:

```ts
// engine/combat/application/combat.service.ts
export class CombatService {
  constructor(private readonly dice: DiceRollerPort) {}

  resolveAttack(attacker: HeroEntity, defender: EnemyEntity): CombatResultType {
    const roll = this.dice.roll('1d20');
    const damage = Math.max(0, roll + attacker.attack - defender.defense);
    const actualDamage = defender.takeDamage(damage);

    return {
      roll,
      damage: actualDamage,
      isCritical: roll === 20,
      isMiss: roll === 1,
    };
  }
}
```

---

## UI — Ink + Componentes ASCII

### Decisão

- **Ink** como renderer React no terminal
- **Componentes próprios** com bordas ASCII (`+---+`, `|`, etc.) — sem boxes lisas do Ink
- **chalk** para cores, **figures** para caracteres Unicode (▓, ░, →)
- **Sem terminal-kit** — Ink cobre input (`useInput`) e renderização

### Componentes base

| Componente | Uso |
|------------|-----|
| `ascii-border.component.tsx` | Caixa com borda `+---+` e título opcional |
| `ascii-menu.component.tsx` | Menu selecionável com `>` (navegação: `j/k` ou setas) |
| `ascii-health-bar.component.tsx` | Barra `[████████░░] 80/100` |
| `ascii-dialog.component.tsx` | Caixa de diálogo estilo RPG |
| `ascii-map.component.tsx` | Renderização do mapa em ASCII |

### Input

- `useInput` do Ink para capturar teclas
- Navegação: `j/k` ou `↑/↓` para mover, `Enter` para confirmar
- Sem menus nativos do terminal-kit — tudo customizado

---

## Testes

Testes espelham a estrutura de `src/`:

```
tests/
├── shared/
│   └── entities/
│       └── hero.entity.spec.ts
├── engine/
│   └── combat/
│       └── application/
│           └── combat.service.spec.ts
├── exploration/
│   └── application/
│       └── dungeon-generator.service.spec.ts
└── narrative/
    └── application/
        └── choice-handler.spec.ts
```

### Regras de teste

- **Unitário**: uma classe por teste, mocks nos ports
- **Integração**: sistemas completos com adapters reais
- **Sem testes de UI** — apenas lógica

```ts
describe('CombatService', () => {
  let diceRoller: Mock<DiceRollerPort>;
  let combat: CombatService;

  beforeEach(() => {
    diceRoller = { roll: vi.fn() };
    combat = new CombatService(diceRoller);
  });

  it('should deal damage equal to roll + attack - defense', () => {
    vi.mocked(diceRoller.roll).mockReturnValue(15);
    const hero = new HeroEntity('1', 'Hero', 50, 50, 10, 5, 1, 0);
    const enemy = new EnemyEntity('2', 'Goblin', 30, 30, 8, 3, 1);

    const result = combat.resolveAttack(hero, enemy);

    expect(result.damage).toBe(15 + 10 - 3); // roll + attack - defense
  });
});
```
