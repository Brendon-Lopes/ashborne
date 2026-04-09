# Roadmap — Ashborne

Passos pequenos e iterativos. Cada item deve ser testado antes de prosseguir.

---

## Fase 1 — Fundação

- [x] Instalar dependências: `ink`, `react`, `chalk`, `figures`, `vitest`, `tsx`
- [x] Configurar `vite.config.ts` com path aliases + React
- [x] Criar `main.tsx` que renderiza `<App />` com Ink
- [x] Criar `<App />` que imprime "Hello, Ashborne!" no terminal
- [x] Validar: `tsx src/main.tsx` mostra texto colorido

---

## Fase 2 — Componentes ASCII

- [x] Criar `ascii-border.component.tsx` — caixa com `+---+`
- [x] Criar `ascii-menu.component.tsx` — lista com `>` selecionável (`j/k` + `Enter`)
- [x] Criar `ascii-health-bar.component.tsx` — barra `[████░░]`
- [x] Validar: tela de teste com todos os componentes renderizando

---

## Fase 3 — Dados (Dice)

- [ ] Criar `shared/ports/dice-roller.port.ts`
- [ ] Criar `infrastructure/dice/dice-roller.service.ts`
- [ ] Criar `shared/types/dice.type.ts` — `DiceNotation = \`${number}d${number}\``
- [ ] Testes unitários: rolagem retorna valor dentro do intervalo
- [ ] Validar: `main.ts` rola 1d20 e imprime resultado

---

## Fase 4 — Entidades Básicas

- [ ] Criar `shared/entities/hero.entity.ts` — HP, attack, defense
- [ ] Criar `shared/entities/enemy.entity.ts` — HP, attack, defense
- [ ] Testes: `takeDamage`, `isAlive`
- [ ] Validar: criar herói e inimigo no `main.ts`, simular ataque

---

## Fase 5 — Combate

- [ ] Criar `engine/combat/domain/combat-result.type.ts`
- [ ] Criar `engine/combat/application/combat.service.ts`
- [ ] Injetar `DiceRollerPort` no combate
- [ ] Testes: ataque normal, crítico (20), erro (1)
- [ ] Validar: `<CombatScreen />` com Ink mostra combate simulado

---

## Fase 6 — Tela de Combate (Ink)

- [ ] Criar `ui/screens/combat.screen.tsx`
- [ ] Renderizar herói + inimigo com `ascii-border`
- [ ] Renderizar HP bars com `ascii-health-bar`
- [ ] Menu de ações: `Atacar`, `Defender`, `Fugir`
- [ ] `useInput` processa escolha → chama `CombatService` → atualiza tela
- [ ] Validar: jogar combate completo no terminal

---

## Fase 7 — Story Graph (Narrativa com Ink)

- [ ] Criar `engine/narrative/domain/story-node.entity.ts`
- [ ] Criar `engine/narrative/domain/choice.type.ts`
- [ ] Criar `engine/narrative/application/choice-handler.ts`
- [ ] Criar `<StoryScreen />` no Ink — renderiza nó + escolhas como `ascii-menu`
- [ ] Criar grafo de exemplo: 5 nós com ramificações
- [ ] Validar: navegar pela história, escolhas mudam o caminho

---

## Fase 8 — Exploração (Grafo Narrativo)

- [ ] Criar `engine/exploration/domain/region.entity.ts` — bioma, dificuldade, descrição
- [ ] Criar `engine/exploration/domain/location.entity.ts` — conexões, eventos, tags
- [ ] Criar `engine/exploration/domain/connection.type.ts` — links entre locais
- [ ] Criar `engine/exploration/application/location-explorer.service.ts` — ações disponíveis e resolução
- [ ] Criar `engine/exploration/application/region-manager.service.ts` — transições entre regiões
- [ ] Testes: grafo com N locais conectados, ações resolvem corretamente
- [ ] Validar: `<ExplorationScreen />` renderiza descrição + escolhas contextuais

---

## Fase 9 — Game Loop

- [ ] Criar `ui/screens/game.screen.tsx` — orquestra exploração + combate + narrativa
- [ ] Fluxo: local → descrição → escolha → resolve (combate/loot/narrativa/movimento) → próximo local
- [ ] Integração com `StoryEngine` para nós Ink como locais
- [ ] Criar `<DeathScreen />` ao morrer
- [ ] Validar: run completa do início à morte

---

## Fase 10 — Meta-Progressão

- [ ] Criar `engine/progression/domain/player-profile.entity.ts`
- [ ] Criar `engine/progression/application/meta-progression.service.ts`
- [ ] Criar `infrastructure/save/save-file.adapter.ts` — JSON em `~/.ashborne/`
- [ ] Alma (moeda) persiste entre runs
- [ ] Validar: morrer → ganhar alma → reiniciar com bônus

---

## Fase 11 — Conteúdo

- [ ] Criar `config/classes.config.ts` — Guerreiro, Mago, Ladino
- [ ] Criar `config/enemies.config.ts` — Goblin, Orc, Skeleton, Dragon
- [ ] Criar `config/items.config.ts` — Poção, Espada, Escudo
- [ ] Criar `config/events.config.ts` — pool de eventos aleatórios
- [ ] Criar `ui/screens/character-creation.screen.tsx`
- [ ] Validar: escolher classe → jogar com stats diferentes

---

## Fase 12 — Polimento

- [ ] Tela título com ASCII art (`figlet`)
- [ ] Transições entre telas
- [ ] Logs de combate formatados
- [ ] Mais eventos narrativos
- [ ] Mais inimigos, mais salas
- [ ] Validar: jogo jogável do início ao fim

---

## Regra de Iteração

> **Um item por vez.** Implementar → testar → commit → próximo.
> Se um item quebrar em mais de um, divida antes de começar.
