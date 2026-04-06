# Interface — Ashborne

## Filosofia Visual

Interface 100% ASCII/Unicode com personalidade retro. Bordas feitas com caracteres `+`, `-`, `|` e cantos `+`. Elementos internos usam blocos Unicode (`█`, `░`, `▓`) e setas (`→`, `►`). Cores via **chalk**.

O jogo é **baseado em texto**, não em tile maps. A exploração acontece por descrições narrativas e escolhas. Mapas ASCII aparecem apenas em momentos pontuais (troca de floor, por exemplo).

### Layout Base

A tela é dividida em **um bloco principal grande** e **blocos menores na parte inferior e direita**:

```
┌─────────────────────────────────────────────────┬─────────────┐
│                                                 │             │
│                                                 │   Status    │
│                                                 │   Panel     │
│              MAIN CONTENT                       │   (right)   │
│              (exploration /                     │             │
│               combat / dialog)                  │             │
│                                                 │             │
│                                                 │             │
│                                                 │             │
├─────────────────────────────────────────────────┼─────────────┤
│                                                 │             │
│              Bottom Panel                       │   Mini      │
│              (log / messages / choices)         │   Map       │
│                                                 │  (optional) │
│                                                 │             │
└─────────────────────────────────────────────────┴─────────────┘
```

---

## 1. Tela de Exploração

```
┌─────────────────────────────────────────────────┬─────────────┐
│  EXPLORACAO — Sala 7: Cripta dos Esquecidos     │ HP ████████░│
│                                                 │ 72/100      │
│  Voce entra em uma cripta umida. O ar e frio    │             │
│  e pesado. Ossos rangem sob seus passos.        │ ATK  15     │
│  Uma tocha tremula a distancia, projetando      │ DEF  8      │
│  sombras que parecem se mover por conta         │             │
│  propria.                                       │ LVL  3      │
│                                                 │             │
│  No chao, marcas de garras arranham a pedra.    │ ALMA   12   │
│  Ha um corredor ao norte e uma porta de         │             │
│  madeira podre ao leste.                        │ FLOOR  7    │
│                                                 │             │
│  O que voce faz?                                │ ─────────── │
│                                                 │             │
│  > [1] Avancar ao norte                         │ N: corredor │
│    [2] Abrir a porta de madeira                 │ E: porta    │
│    [3] Examinar as marcas no chao               │ S: cripta   │
│    [4] Usar pocao                               │ W: parede   │
│    [5] Descansar                                │             │
│                                                 │             │
├─────────────────────────────────────────────────┴─────────────┤
│ [LOG] Voce entrou na Cripta dos Esquecidos.                   │
│ [LOG] O ar e frio e pesado aqui.                              │
│ [ITEM] Pocao de Vida x2  |  [I]nventario  [M]apa              │
└───────────────────────────────────────────────────────────────┘
```

### Mapa ASCII (ocasional — troca de floor)

O mapa aparece apenas em momentos especiais, como ao descer um novo floor:

```
┌─────────────────────────────────────────────────┬─────────────┐
│  MAPA — Floor 8: Ossuario                       │ HERO        │
│                                                 │             │
│  Voce desce as escadas. O ossuario se           │ HP ████████░│
│  estende diante dos seus olhos:                 │ 72/100      │
│                                                 │             │
│     +-------+     +---------------+             │ ATK  15     │
│     | ENTRADA|-----|   SALAO      |             │ DEF  8      │
│     |   @    |     |    CENTRAL   |-----+       │ LVL  3      │
│     +---+---+     +-------+-------+     |       │             │
│         |                 |             |       │ ALMA   12   │
│     +---+---+     +-------+-------+   +-+-+     │             │
│     | CRIPTA |     |  ALTAR       |   | S |     │ FLOOR  8   │
│     |   !    |     |    $         |   | A |     │             │
│     +-------+     +--------------+   | I |     │             │
│                                      | D |     │             │
│  Legenda: @ voce  ! inimigo          | A |     │             │
│           $ tesouro  - corredor      |   |     │             │
│                                      +---+     │             │
│  [ESC] voltar                                   │             │
├─────────────────────────────────────────────────┴─────────────┤
│ [MAPA] Floor 8 — 4 salas descobertas, 2 ocultas.              │
└───────────────────────────────────────────────────────────────┘
```

---

## 2. Tela de Combate

A definir.

---

## 3. Tela de Dialogo / Narrativa

```
┌──────────────────────────────────────────────────┬─────────────┐
│  NARRATIVA                                       │ HERO        │
│                                                  │             │
│  ╔════════════════════════════════════════════╗  │ HP ████████░│
│  ║                                            ║  │ 72/100      │
│  ║   "Ah, outro perdido nestas profundezas..."║  │             │
│  ║                                            ║  │ ATK  15     │
│  ║    O mercador ajusta seus oculos e sorri.  ║  │ DEF  8      │
│  ║    Ele pousa uma lanterna sobre o balcao.  ║  │ LVL  3      │
│  ║                                            ║  │             │
│  ║    "Tenho coisas interessantes hoje.       ║  │ ALMA   12   │
│  ║     Mas aviso: nada e de graca aqui."      ║  │             │
│  ║                                            ║  │             │
│  ║                          — Mercador Silas  ║  │             │
│  ╚════════════════════════════════════════════╝  │             │
│                                                  │             │
│  O que voce responde?                            │             │
│                                                  │             │
│  > [1] "Mostre suas mercadorias."                │             │
│    [2] "Como voce sobrevive aqui?"               │             │
│    [3] [Intimidar] "Precos ou sangue." (1d20)    │             │
│    [4] Sair da conversa                          │             │
│                                                  │             │
├──────────────────────────────────────────────────┴─────────────┤
│ [NPC] Mercador Silas encontrado na Sala 7                      │
│ [LOG] Ele parece saber mais do que diz...                      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. Tela de Inventario

```
┌─────────────────────────────────────────────────┬─────────────┐
│  INVENTARIO                          [1/10] slots│ HERO        │
│                                                 │             │
│  Equipado:                                      │ HP ████████░│
│  ┌─────────────────────────────────────────┐    │ 72/100      │
│  │ Mao Direita: Espada Curva (+8 ATK)      │    │             │
│  │ Mao Esquerda: Escudo de Madeira (+3 DEF)│    │ ATK  15     │
│  │ Corpo: Giba de Couro (+2 DEF)           │    │ DEF  8      │
│  └─────────────────────────────────────────┘    │ LVL  3      │
│                                                 │             │
│  Itens:                                         │ ALMA   12   │
│                                                 │             │
│  > [1] Pocao de Vida        x2   [+25 HP]      │             │
│    [2] Pocao de Forca       x1   [+5 ATK 3turn]│             │
│    [3] Chave Enferrujada    x1                  │             │
│    [4] Tocha                x3                  │             │
│    [5] Racao                x1                  │             │
│    [ ]                                         │             │
│    [ ]                                         │             │
│                                                 │             │
│  ─────────────────────────────────────────      │             │
│  [E]quipar  [U]sar  [D]escartar  [ESC] voltar  │             │
│                                                 │             │
├─────────────────────────────────────────────────┴─────────────┤
│ [ITEM] Pocao de Vida: Restaura 25 HP. Brilha com um calor... │
│ [LOG] Voce tem 5 slots livres restantes.                      │
└───────────────────────────────────────────────────────────────┘
```

---

## 5. Tela de Morte / Game Over

```
┌─────────────────────────────────────────────────┬─────────────┐
│                                                 │             │
│                                                 │  RUN STATS  │
│     ██████╗ ██████╗ ███████╗██╗   ██╗           │             │
│    ██╔════╝██╔═══██╗██╔════╝╚██╗ ██╔╝           │ Floors:  7  │
│    ██║     ██║   ██║█████╗   ╚████╔╝            │ Kills:  23  │
│    ██║     ██║   ██║██╔══╝    ╚██╔╝             │ Almas:  12  │
│    ╚██████╗╚██████╔╝███████╗   ██║              │             │
│     ╚═════╝ ╚═════╝ ╚══════╝   ╚═╝              │ LVL:     3 │
│                                                 │             │
│  ─────────────────────────────────────────      │ ─────────── │
│                                                 │             │
│    A escuridao consome mais uma alma.           │ +5 ALMA     │
│    Ashborne, seu sangue alimenta as             │   bonus     │
│    profundezas. Mas a maldicao nao              │   linhagem  │
│    permite descanso eterno...                   │             │
│                                                 │             │
│                                                 │             │
│    > [1] Renascer (custo: 0 almas)              │             │
│      [2] Desistir                                 │             │
│                                                 │             │
│                                                 │             │
├─────────────────────────────────────────────────┴─────────────┘
│ [DEATH] Voce morreu na Cripta dos Esquecidos.                   │
│ [META] +5 almas coletadas. Total: 17                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Tela de Criacao de Personagem

```
┌─────────────────────────────────────────────────┬─────────────┐
│  CRIACAO DE PERSONAGEM                          │ PREVIEW     │
│                                                 │             │
│  Nome: [ Brendon_____________ ]                 │  ┌───────┐  │
│                                                 │  |  @    |  │
│  Classe:                                        │  | /|\   |  │
│                                                 │  | / \   |  │
│  > [1] [X] Guerreiro                            │  └───────┘  │
│    [2] [~] Mago                                 │             │
│    [3] [>] Ladino                               │ HP  100     │
│                                                 │ ATK  15     │
│  ─────────────────────────────────────────      │ DEF  10     │
│                                                 │             │
│  Guerreiro                                      │ Espada      │
│  "Forja e aco. O caminho direto."               │ Longa       │
│                                                 │             │
│  HP:  ████████████████░░░░  120                 │             │
│  ATK: ████████████░░░░░░░░   15                 │             │
│  DEF: ██████████████░░░░░░   10                 │             │
│  SPD: ████████░░░░░░░░░░░░    8                 │             │
│                                                 │             │
│  Habilidade: Grito de Guerra                    │             │
│  (Proximo ataque causa dano dobrado)            │             │
│                                                 │             │
├─────────────────────────────────────────────────┴─────────────┘
│ [HINT] Escolha sabiamente. A classe nao pode ser mudada.      │
│ [j/k] navegar  [Enter] confirmar                              │
└───────────────────────────────────────────────────────────────┘
```

---

## 7. Mini-Mapa (Painel Direito — Opcional)

O mini-mapa aparece apenas em momentos especiais (troca de floor, ao usar um item de revelacao). Mostra a estrutura do floor atual:

```
┌─────────────┐
│   MAPA F7   │
│             │
│  +----+     │
│  | @  |--+  │
│  +----+  |  │
│          +--+----+  │
│          |     |  │
│     +----+  $  |  │
│     | !  |     |  │
│     +----+--+--+  │
│             |     │
│          +--+--+  │
│          | >   |  │
│          +-----+  │
│             │
│  @ Voce       │
│  ! Inimigo    │
│  $ Tesouro    │
│  > Escada     │
│  - Corredor   │
└─────────────┘
```

---

## 8. Barra de Status Compacta (Painel Direito)

```
┌─────────────┐
│  ASHBORNE   │
│             │
│  HP ████████░│
│    72/100   │
│             │
│  ATK 15     │
│  DEF  8     │
│             │
│  * Nivel 3  │
│  ░░░░░█░░░  │
│  180/300 XP │
│             │
│  <> Alma: 12│
│             │
│  === Floor==│
│      7      │
│             │
│  Turno: 1   │
│             │
│  - Efeitos -│
│  +5 ATK (2) │
│             │
└─────────────┘
```

---

## 9. Tela de Loja / Mercador

```
┌─────────────────────────────────────────────────┬─────────────┐
│  MERCADOR — Silas                               │ HERO        │
│                                                 │             │
│  ╔═══════════════════════════════════════════╗  │ HP ████████░│
│  ║  "Faca suas escolhas, Ashborne. O ouro   ║  │ 72/100      │
│  ║   fala mais alto que suplicas."          ║  │             │
│  ╚═══════════════════════════════════════════╝  │ ATK  15     │
│                                                 │ DEF  8      │
│  Suas Almas: <> 12                              │             │
│                                                 │ <> Alma: 12 │
│  ─────────────────────────────────────────      │             │
│                                                 │             │
│  COMPRAR:                                       │             │
│                                                 │             │
│  > [1] Pocao de Vida        <> 3   [+25 HP]    │             │
│    [2] Pocao de Forca       <> 5   [+5 ATK 3t] │             │
│    [3] Espada Longa         <> 8   [+12 ATK]   │             │
│    [4] Escudo de Ferro      <> 6   [+5 DEF]    │             │
│    [5] Antidoto             <> 2                │             │
│                                                 │             │
│  VENDER:                                        │             │
│  [6] Chave Enferrujada      <> 1                │             │
│  [7] Dente de Goblin        <> 2                │             │
│                                                 │             │
│  ─────────────────────────────────────────      │             │
│  [ESC] Sair da loja                             │             │
│                                                 │             │
├─────────────────────────────────────────────────┴─────────────┤
│ [SHOP] "Boa escolha. A lamina ja cortou muitos pescocos..."  │
└───────────────────────────────────────────────────────────────┘
```

---

## 10. Tela de Evento / Armadilha

```
┌─────────────────────────────────────────────────┬─────────────┐
│  EVENTO — Armadilha!                            │ HERO        │
│                                                 │             │
│         !  !  !  !  !  !  !                     │ HP ████████░│
│                                                 │ 72/100      │
│  Voce ouve um clique sob seu pe.                │             │
│  Flechas giratorias emergem das paredes!        │ ATK  15     │
│                                                 │ DEF  8      │
│                                                 │             │
│  Reaja rapido!                                  │ LVL  3      │
│                                                 │             │
│  > [1] [Reflexos] Esquivar (1d20 + SPD)         │ ALMA   12   │
│    [2] [Resistir] Bloquear com escudo (1d20)    │             │
│    [3] [Sorte] Aceitar o destino (1d6)          │             │
│                                                 │             │
│                                                 │             │
│                                                 │             │
│                                                 │             │
│                                                 │             │
│                                                 │             │
├─────────────────────────────────────────────────┴─────────────┤
│ [TRAP] Armadilha de Flechas — Dano base: 15                   │
│ [DICE] Aguardando rolagem...                                  │
└───────────────────────────────────────────────────────────────┘
```

---

## 11. Tela de Nivel Up

```
┌─────────────────────────────────────────────────┬─────────────┐
│  * NIVEL ACIMA!                                 │ HERO        │
│                                                 │             │
│         *  *  *  *  *                           │ HP ████████░│
│       *   *   *   *   *                         │ 72/100      │
│         *  *  *  *  *                           │             │
│                                                 │ ATK  15     │
│  Voce sente o poder fluir pelas                 │ DEF  8      │
│  suas veias. A maldicao Ashborne                │             │
│  se fortalece...                                │ LVL  3→4    │
│                                                 │             │
│  Nivel 3  →  Nivel 4                            │ ALMA   12   │
│                                                 │             │
│  Escolha um atributo para aumentar:             │             │
│                                                 │             │
│  > [1] [HP] Vitalidade  (+15 HP max)           │             │
│    [2] [X] Forca       (+3 ATK)                 │             │
│    [3] [SHD] Resistencia (+3 DEF)               │             │
│    [4] [>>] Agilidade    (+2 SPD)               │             │
│                                                 │             │
│                                                 │             │
├─────────────────────────────────────────────────┴─────────────┤
│ [LEVEL UP] +1 ponto de atributo. Escolha com sabedoria.       │
└───────────────────────────────────────────────────────────────┘
```

---

## Caracteres e Simbolos

### Bordas

| Uso       | Caracteres                    |
| --------- | ----------------------------- | --------------- |
| Caixa     | `+---+`, `                    | `, `+` (cantos) |
| Separador | `───`, `═══`                  |
| Dialogo   | `╔═══╗`, `║`, `╚═══╝` (duplo) |

### Blocos e Preenchimento

| Char | Uso                    |
| ---- | ---------------------- |
| `█`  | Barra de HP cheia      |
| `░`  | Barra de HP vazia      |
| `▓`  | Area explorada no mapa |
| `░`  | Area nao explorada     |

### Indicadores

| Char   | Uso                      |
| ------ | ------------------------ |
| `>`    | Item selecionado no menu |
| `→`    | Setas de direcao/acao    |
| `►`    | Marcador de progresso    |
| `[x]`  | Inimigo morto            |
| `*`    | Nivel / estrela          |
| `<>`   | Alma (moeda)             |
| `!`    | Aviso / armadilha        |
| `[X]`  | Combate / ataque         |
| `[HP]` | Vida                     |

---

## Cores (chalk)

| Elemento        | Cor          | Exemplo chalk       |
| --------------- | ------------ | ------------------- |
| Bordas          | Cinza escuro | `chalk.gray`        |
| Titulo          | Amarelo      | `chalk.yellow.bold` |
| HP alto (>60%)  | Verde        | `chalk.green`       |
| HP medio (30%)  | Amarelo      | `chalk.yellow`      |
| HP baixo (<30%) | Vermelho     | `chalk.red.bold`    |
| Dano            | Vermelho     | `chalk.red`         |
| Cura            | Verde        | `chalk.green`       |
| Alma            | Ciano        | `chalk.cyan`        |
| Log             | Cinza claro  | `chalk.gray`        |
| Selecao (`>`)   | Branco bold  | `chalk.white.bold`  |
| Inimigo         | Vermelho     | `chalk.red`         |
| NPC             | Magenta      | `chalk.magenta`     |
| Item            | Verde        | `chalk.green`       |

---

## Navegacao

| Tecla     | Acao                        |
| --------- | --------------------------- |
| `j` / `↓` | Mover selecao para baixo    |
| `k` / `↑` | Mover selecao para cima     |
| `h` / `←` | Mover selecao para esquerda |
| `l` / `→` | Mover selecao para direita  |
| `Enter`   | Confirmar selecao           |
| `Esc`     | Voltar / cancelar           |
| `1-9`     | Selecao rapida por numero   |
| `i`       | Abrir inventario            |
| `m`       | Abrir mapa (se disponivel)  |

---

## Componentes Reutilizaveis

| Componente                       | Uso                                   |
| -------------------------------- | ------------------------------------- |
| `ascii-border.component.tsx`     | Caixa com borda `+---+` e titulo      |
| `ascii-menu.component.tsx`       | Menu com `>` selecionavel             |
| `ascii-health-bar.component.tsx` | Barra `[████████░░] 80/100`           |
| `ascii-dialog.component.tsx`     | Caixa de dialogo estilo RPG (borda ═) |
| `ascii-map.component.tsx`        | Renderizacao do mapa em ASCII (raro)  |
| `ascii-stat-bar.component.tsx`   | Barra generica de stat (XP, etc)      |
| `ascii-portrait.component.tsx`   | Retrato ASCII de NPC/inimigo          |
| `ascii-log.component.tsx`        | Painel de log na parte inferior       |

---

## Notas de Implementacao

- **Ink** (React) renderiza os componentes no terminal.
- **`useInput`** captura teclas para navegacao.
- **`chalk`** aplica cores aos caracteres.
- **`figures`** fornece caracteres Unicode quando necessario.
- Bordas sao desenhadas com caracteres ASCII puros (`+`, `-`, `|`), **nao** com boxes do Ink.
- O layout deve se adaptar ao tamanho minimo do terminal: **80x24**.
- Painel direito tem largura fixa de ~14 colunas.
- Painel inferior tem altura fixa de ~3 linhas.
- **Sem tile maps na exploracao normal** — o jogo e baseado em texto e escolhas narrativas.
- **Mapas ASCII sao ocasionais** — aparecem em troca de floor ou ao usar itens de revelacao.
