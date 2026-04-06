# Convenções de Código — Ashborne

## Clean Code

### Princípios

1. **Funções pequenas** — máximo 30 linhas, faz uma coisa só
2. **Nomes autoexplicativos** — sem comentários pra dizer o que faz
3. **Sem magia** — números e strings nomeados em `config/` ou `utils/constants.ts`
4. **Imutabilidade por padrão** — `readonly` sempre que possível
5. **Sem `any`** — TypeScript é estrito, use tipos corretos

### Funções

```ts
// ✅ Bom — nome diz o que faz, uma responsabilidade
function isCriticalHit(roll: number): boolean {
  return roll === 20;
}

// ❌ Ruim — nome vago, faz demais
function process(x: any): any {
  // 50 linhas de lógica misturada
}
```

### Variáveis

```ts
// ✅ Bom
const maxHitPoints = 100;
const isPlayerAlive = true;
const damageDealt = 15;

// ❌ Ruim
const hp = 100;
const alive = true;
const dmg = 15;
```

### Classes

- **Máximo 200 linhas** — se passou, quebre em classes menores
- **Constructor injection** — nunca `new` dentro de classes de serviço
- **`readonly`** em todas as dependências injetadas
- **Métodos privados** pra lógica interna

```ts
export class CombatSystem {
  constructor(
    private readonly dice: DiceRollerPort,
    private readonly logger: LoggerPort,
  ) {}

  resolveAttack(attacker: HeroEntity, defender: EnemyEntity): CombatResultType {
    const roll = this.rollAttack();
    const damage = this.calculateDamage(roll, attacker, defender);
    const result = this.applyDamage(defender, damage);

    this.logCombat(attacker, defender, result);
    return result;
  }

  private rollAttack(): number {
    return this.dice.roll('1d20');
  }

  private calculateDamage(roll: number, attacker: HeroEntity, defender: EnemyEntity): number {
    return Math.max(0, roll + attacker.attack - defender.defense);
  }

  private applyDamage(defender: EnemyEntity, damage: number): CombatResultType {
    const actualDamage = defender.takeDamage(damage);
    return {
      damage: actualDamage,
      isCritical: false,
      isMiss: false,
    };
  }

  private logCombat(attacker: HeroEntity, defender: EnemyEntity, result: CombatResultType): void {
    this.logger.log(`${attacker.name} dealt ${result.damage} to ${defender.name}`);
  }
}
```

---

## Estilo

### Aspas

- **Simples** `'assim'` — consistente em todo o projeto

### Ponto e vírgula

- **Sempre** — `semi: true` no tsconfig

### Ordem de imports

```ts
// 1. Node built-ins
import path from 'node:path';

// 2. External packages
import chalk from 'chalk';
import terminal from 'terminal-kit';

// 3. Internal — ports (camada mais interna)
import type { DiceRollerPort } from '../core/ports/dice-roller.port.js';
import type { RendererPort } from '../core/ports/renderer.port.js';

// 4. Internal — entities
import { HeroEntity } from '../core/entities/hero.entity.js';

// 5. Internal — siblings
import { DamageCalculator } from './damage.calculator.js';

// 6. Internal — utils
import { formatNumber } from '../utils/format.util.js';
```

### Linhas em branco

- **1 linha** entre imports de grupos diferentes
- **2 linhas** entre declarações de classe/função top-level

---

## TypeScript Estrito

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Tipos de retorno

**Sempre declare** — nunca confie na inferência em funções públicas:

```ts
// ✅ Bom
function calculateDamage(attack: number, defense: number): number {
  return Math.max(0, attack - defense);
}

// ❌ Ruim — inferido, difícil de entender a intenção
function calculateDamage(attack: number, defense: number) {
  return Math.max(0, attack - defense);
}
```

### Type vs Interface

| Use         | Quando                                         |
| ----------- | ---------------------------------------------- |
| `type`      | Uniões, tuples, tipos primitivos, mapped types |
| `interface` | Contratos de objetos que podem ser estendidos  |

```ts
// type — união
type DiceNotation = `${number}d${number}`;

// type — tuple
type Position = [number, number];

// interface — contrato de objeto
interface CombatResultType {
  readonly damage: number;
  readonly isCritical: boolean;
  readonly isMiss: boolean;
}
```

### Enums

Use enums **apenas** para conjuntos fechados e conhecidos:

```ts
// ✅ Bom — conjunto fechado
export enum CharacterClassEnum {
  Warrior = 'warrior',
  Mage = 'mage',
  Rogue = 'rogue',
}

// ❌ Ruim — vai crescer demais
export enum EnemyTypeEnum {
  Goblin = 'goblin',
  Orc = 'orc',
  Skeleton = 'skeleton',
  Dragon = 'dragon',
  // ... 50 depois
}

// ✅ Melhor — union type pra conjuntos abertos
export type EnemyType = string; // definido em config
```

---

## Tratamento de Erros

### Errors customizados

```ts
// core/errors/game.error.ts
export class GameError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'GameError';
  }
}

// core/errors/combat.error.ts
export class CombatError extends GameError {
  constructor(message: string) {
    super(message, 'COMBAT_ERROR');
    this.name = 'CombatError';
  }
}
```

### Uso

```ts
// ✅ Bom — erro específico com contexto
if (!hero.isAlive()) {
  throw new CombatError('Cannot attack: hero is dead');
}

// ❌ Ruim — genérico
if (!hero.isAlive()) {
  throw new Error('oops');
}
```

### Result pattern (opcional)

Pra erros esperados (não exceções):

```ts
export type Result<T, E = GameError> = { ok: true; value: T } | { ok: false; error: E };

function tryOpenDoor(room: RoomEntity): Result<void> {
  if (!room.hasDoor) {
    return { ok: false, error: new GameError('No door to open', 'NO_DOOR') };
  }
  room.isDoorOpen = true;
  return { ok: true, value: undefined };
}
```

---

## Testes

### Estrutura

```
tests/
├── core/
│   └── entities/
│       └── hero.entity.spec.ts
├── engine/
│   ├── combat/
│   │   └── combat.system.spec.ts
│   └── dice/
│       └── dice-roller.service.spec.ts
└── narrative/
    └── choice-handler.spec.ts
```

### Naming

```ts
describe('HeroEntity', () => {
  describe('takeDamage', () => {
    it('should reduce HP by damage amount minus defense', () => {
      // ...
    });

    it('should not reduce HP below zero', () => {
      // ...
    });

    it('should return actual damage dealt', () => {
      // ...
    });
  });
});
```

### Regras

- **1 `describe` por classe**
- **1 `describe` por método**
- **1 `it` por cenário**
- **AAA pattern**: Arrange, Act, Assert
- **Mocks nos ports**, nunca na implementação

```ts
describe('CombatSystem', () => {
  let diceRoller: Mock<DiceRollerPort>;
  let combat: CombatSystem;

  beforeEach(() => {
    diceRoller = { roll: vi.fn() };
    combat = new CombatSystem(diceRoller);
  });

  it('should deal damage equal to roll + attack - defense', () => {
    // Arrange
    vi.mocked(diceRoller.roll).mockReturnValue(15);
    const hero = createHero({ attack: 10 });
    const enemy = createEnemy({ defense: 3 });

    // Act
    const result = combat.resolveAttack(hero, enemy);

    // Assert
    expect(result.damage).toBe(22); // 15 + 10 - 3
  });
});
```

---

## Commits

### Convenção (Conventional Commits)

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type       | Quando                          |
| ---------- | ------------------------------- |
| `feat`     | Nova funcionalidade             |
| `fix`      | Correção de bug                 |
| `refactor` | Mudança sem mudar comportamento |
| `style`    | Formatação, lint                |
| `test`     | Adicionar/modificar testes      |
| `docs`     | Documentação                    |
| `chore`    | Build, config, tooling          |

### Exemplos

```
feat(combat): add critical hit system
fix(dice): fix off-by-one in d20 roll
refactor(engine): extract damage calculator
docs: add architecture guide
test(hero): add unit tests for entity
```

---

## ESLint (recomendado)

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/consistent-type-imports": "error",
    "no-console": "warn",
    "prefer-const": "error",
    "eqeqeq": ["error", "always"]
  }
}
```

---

## Checklist de PR

Antes de abrir um PR:

- [ ] Código segue convenção de nomes (kebab-case + sufixos)
- [ ] Nenhuma dependência apontando pra fora da camada
- [ ] Sem `any` — tipos explícitos
- [ ] Funções com tipo de retorno declarado
- [ ] Testes escritos pra lógica nova
- [ ] `npm run lint` passa
- [ ] `npm run test` passa
- [ ] Commit segue conventional commits
