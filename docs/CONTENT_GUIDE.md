# CONTENT_GUIDE.md — Guia de Criação de Conteúdo

Como criar eventos, inimigos e classes sem tocar em código.
Todos os arquivos ficam em `data/` e são validados automaticamente pelo Zod.

---

## Eventos (`data/events/`)

Eventos são momentos de escolha moral. O jogador lê um contexto e
escolhe entre 2-4 opções, cada uma com consequências narrativas e mecânicas.

> **Regra de i18n:** todos os campos de texto visível ao jogador (`title`, `context`,
> `label`, `narrative`) são objetos multilíngues com `pt` e `en`.
> Sempre criar `pt` primeiro. IDs nunca são traduzidos.

### Schema completo anotado

```yaml
# Nome do arquivo: kebab-case.yaml (ex: dying-merchant.yaml)
# O id deve ser igual ao nome do arquivo sem extensão

id: dying-merchant # único globalmente, kebab-case
title: # campo multilíngue — sempre pt + en
  pt: O Mercador Moribundo
  en: The Dying Merchant
trigger: outskirts_merchant_encounter # id do ponto de interesse onde o evento aparece

context:
  pt: |
    Um mercador está caído entre caixas derrubadas.
    Sua mercadoria está espalhada. Ele respira com dificuldade.
    "Leva tudo", ele diz. "Não vou precisar."
  en: |
    A merchant lies fallen among toppled crates.
    His wares are scattered. He breathes with difficulty.
    "Take it all", he says. "I won't need it."

choices:
  - id: help
    label:
      pt: Ajudar o mercador
      en: Help the merchant
    moralWeight: 2
    consequence:
      narrative:
        pt: |
          Você trata seus ferimentos com o que tem.
          Ele agradece com os olhos. Não tem mais palavras.
        en: |
          You treat his wounds with what you have.
          He thanks you with his eyes. He has no more words.
      reward:
        gold: 20 # gold ganho (opcional)
        xp: 15 # xp ganho (opcional)
        item: 'bandage' # id de item (opcional, deve existir)
        loreFragment: 'merchant_past_01' # id de fragmento (opcional)

  - id: take-goods
    label: Pegar as mercadorias e ir embora
    moralWeight: -1
    consequence:
      narrative: |
        Você recolhe o que tem valor.
        Ele acompanha com o olhar. Sem julgamento. Apenas cansaço.
      reward:
        gold: 45

  - id: end-suffering
    label: Encerrar o sofrimento dele
    moralWeight: -2 # ação de peso moral alto
    consequence:
      narrative: |
        É rápido. Ele não resiste.
        O silêncio depois parece mais pesado que o de antes.
      reward:
        gold: 60
        item: 'merchants_ring' # item especial — justificado narrativamente
      unlock: 'enemy_type_wraith_merchant' # desbloqueia variante de inimigo

  - id: ignore
    label: Continuar andando
    # moralWeight omitido = 0 (neutro)
    consequence:
      narrative: |
        Você passa sem olhar.
        Atrás de você, o som da respiração eventualmente para.
      reward: {} # sem recompensa — também válido
```

### Boas práticas para eventos

**Faça:**

- Contexto atmosférico, não expositivo
- Escolhas que pareçam razoáveis — nenhuma deve ser obviamente "errada"
- Consequências que o mundo sente, não só o inventário
- Pelo menos uma escolha com peso moral negativo e uma com positivo
- Recompensas inversamente proporcionais ao peso moral
- **Sempre criar campos `pt` e `en` em todos os textos visíveis** (`title`, `context`, `label`, `narrative`)

**Evite:**

- Escolhas com resposta "certa" óbvia
- Narrativa que quebra o tom (humor, referências modernas)
- Recompensas que tornam a escolha fácil ("ajudar dá 100 gold E um item raro")
- Explicar o lore diretamente ("você sabe que isso é resultado do ciclo eterno")

---

## Inimigos (`data/enemies/`)

### Schema completo anotado

```yaml
id: goblin-ashen # único globalmente
name: Goblin Cinzeiro # nome exibido no jogo
lore: |
  # Descrição de lore. Exibida no Arquivo após primeira derrota.
  # Tom consistente com o mundo — não "monstros do mal", mas criaturas
  # que existem porque algo as fez existir, sem propósito claro.
  Foram humanos uma vez. Dizem. Os registros não são claros
  sobre quando a transformação começou, apenas que não parou.

regionRange: ['outskirts', 'lower_city'] # em quais regiões pode aparecer [min, max]
isBoss: false # true apenas para bosses de região

# Stats — balancear com DESIGN.md como referência
hp: 25
maxHp: 25
attributes:
  STR: 10 # 8-12 para inimigos fracos, 14-18 para bosses
  DEX: 12
  CON: 10
  INT: 6
  WIS: 8
  CHA: 4

actions:
  - id: claw-strike
    label: Arranhão # exibido como intenção
    description: Um golpe rápido com garras enferrujadas.
    damageDie: 6 # d4/d6/d8/d10/d12
    damageCount: 1 # quantidade de dados
    damageModifier: 0 # modificador fixo (atributo do inimigo já é considerado)

  - id: feral-bite
    label: Mordida Feroz
    description: Morde com força desesperada.
    damageDie: 8
    damageCount: 1
    damageModifier: 1
    effect: 'bleeding' # aplica status effect (ver lista abaixo)
```

### Effects disponíveis para ações de inimigos

`poison | bleeding | burning | stunned | cursed | weakened`

### Balanceamento por região

| Região   | HP      | Dano médio por turno | Effects          |
| -------- | ------- | -------------------- | ---------------- |
| 1        | 20-30   | 5-8                  | nenhum           |
| 2        | 30-45   | 8-12                 | 1 effect leve    |
| 3 (boss) | 70-90   | 12-18                | 2 effects        |
| 4        | 45-60   | 12-16                | 1-2 effects      |
| 5        | 60-80   | 15-22                | 2 effects fortes |
| 6 (boss) | 110-130 | 18-28                | múltiplos, fases |

### Boas práticas para inimigos

**Faça:**

- Lore que sugere história, não apenas natureza ("foram humanos uma vez")
- Ações com nomes evocativos ("Arranhão da Melancolia", não "Ataque 1")
- Mix de ações: uma forte/lenta, uma rápida/fraca, uma com efeito
- Bosses com pelo menos 3-4 ações para variedade

**Evite:**

- Inimigos com dano muito consistente (sem variação = sem tensão)
- Nomes genéricos ("Goblin 1", "Esqueleto Forte")
- Lore que explica demais ("este goblin foi criado pelo feiticeiro X para proteger Y")

---

## Classes (`data/classes/`)

### Schema completo anotado

```yaml
id: warrior # "warrior" | "mage" | "archer" | futuras
name: Guerreiro # nome exibido na seleção
description: |
  # 2-3 linhas. Tom da seleção de personagem — épico, pessoal.
  # Deve fazer o jogador querer jogar essa classe.
  Carrega cicatrizes que não lembra como ganhou.
  Avança porque parar parece mais perigoso.

lore: |
  # Lore mais profundo, exibido no Arquivo.
  # Consistente com STORY.md.
  Os guerreiros de Ashborne não são escolhidos por bravura.
  São escolhidos porque não têm mais nada a perder.

startingAttributes:
  STR: 14 # Guerreiro: STR/CON altos
  DEX: 10
  CON: 14
  INT: 8
  WIS: 10
  CHA: 8

startingHp: 60
startingEnergy: 5

actions:
  - id: heavy-strike
    label: Golpe Pesado
    description: Um golpe lento mas devastador.
    energyCost: 2
    damageDie: 8
    damageCount: 1
    damageModifier: 2 # bônus fixo SOMADO ao modificador do atributo (STR/DEX/INT)

  - id: defensive-stance
    label: Postura Defensiva
    description: Próximo ataque recebido reduzido em 50%.
    energyCost: 1
    # Sem dano — efeito implementado no sistema de combate
    effect: 'protected'

  - id: war-cry
    label: Grito de Guerra
    description: Aumenta dano por 3 turnos.
    energyCost: 3
    effect: 'empowered'

  - id: resilience
    label: Resiliência
    description: Regenera HP quando em estado crítico.
    energyCost: 0 # passiva — energyCost 0 indica passiva
    # Lógica implementada no sistema de personagem

> **Nota:** `damageModifier` é um bônus adicional que se soma ao modificador do atributo
> da classe (STR para corpo a corpo, DEX para distância, INT para mágico).
> Dano final = `roll(damageDie, damageCount) + atributo_modifier + damageModifier`.
```

### Balanceamento de classes

**Guerreiro:** Mais HP, menos energia, dano consistente
**Mago:** Menos HP, mais energia, dano alto mas irregular
**Arqueiro:** HP médio, energia média, dano por efeitos acumulados

---

## Lore World (`data/world.md`)

Frontmatter YAML + conteúdo Markdown.

```markdown
---
title: Ashborne
fragments:
  - id: fragment_id # único globalmente
    title: Título do Fragmento
    content: >
      Texto do fragmento. Uma única revelação.
      2-4 sentenças. Enigmático.
      Revelação parcial — nunca o quadro completo.
---

# Conteúdo geral do mundo

Texto em Markdown usado como contexto geral para o Narrator.
Não exibido diretamente ao jogador.
```

### Ordem de revelação dos fragmentos

Ver `STORY.md` seção "Fragmentos de Lore — ordem de revelação".
Novos fragmentos devem respeitar a ordem narrativa planejada.

---

## Templates de Prompt (`data/prompts/templates.yaml`)

Permite customizar os prompts da IA sem alterar código.

```yaml
world_tone: |
  You are the narrator of Ashborne...
  # Tom geral — veja narrator.ts para o padrão atual

prologue_hint: |
  # Hint adicional para o prólogo, se quiser customizar
```

Esses templates são opcionais — o Narrator tem defaults internos.
Use para ajustar o tom sem recompilar.

---

## Traduções (`data/i18n/`)

Strings de UI e prompts do Narrator ficam aqui, separados por locale.

### Estrutura dos arquivos

```
data/i18n/
├── pt.json   ← português (padrão — sempre criar primeiro)
└── en.json   ← inglês
```

### Chaves obrigatórias em cada locale

```json
{
  "ui": {
    "hp": "HP",
    "energy": "Energia",
    "turn": "Turno",
    "region": "Região",
    "inventory": "Inventário",
    "archive": "O Arquivo",
    "flee": "Fugir"
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
  "narrator_tone": "Você é o narrador de Ashborne, um mundo de dark fantasy..."
}
```

### Como adicionar um novo idioma

1. Criar `data/i18n/{locale}.json` com todas as chaves acima
2. Adicionar campos `{locale}: "..."` nos YAMLs de eventos, inimigos e classes
3. Mudar `GAME_LOCALE={locale}` no `.env`
4. Não é necessário alterar nenhum código

### Campos multilíngues em YAML

Qualquer campo de texto visível ao jogador usa este padrão:

```yaml
# Campo simples
title:
  pt: A Vila Amaldiçoada
  en: The Cursed Village

# Campo de texto longo
context:
  pt: |
    Uma vila silenciosa. Casas vazias.
  en: |
    A silent village. Empty houses.

# Label de escolha
label:
  pt: Aproximar-se da criança
  en: Approach the child
```

**O que NÃO traduzir:**

- `id` — sempre inglês/kebab-case (`cursed-village`, não `vila-amaldicoada`)
- `effect` — valores de sistema (`poison`, `bleeding`, etc.)
- `unlock` — ids de referência
- `relic`, `item` — ids de referência

---

## Scripts Ink (`data/narrative/`)

Ink é a linguagem de scripting narrativo usada para diálogos de NPCs,
cenas de história e sonhos. Sintaxe simples, suporta variáveis e condições.

### Estrutura básica

```ink
// Variáveis globais — declarar no topo, espelham RunState
VAR moral_score = 0
VAR fragments_found = 0
VAR oracle_met = false

// Knot = cena/momento narrativo (snake_case)
=== nome_da_cena ===
Texto que aparece na tela.

// Escolhas do jogador
* [Opção 1]
    Consequência da opção 1.
    -> outro_knot
* [Opção 2]
    Consequência da opção 2.
    -> END

// Condicionais
{ moral_score < -3:
    Texto se moral sombrio.
- else:
    Texto padrão.
}
```

### Tags disponíveis

```ink
Linha de texto. # AI_HINT: contexto para a IA enriquecer essa linha
Outro texto.    # GAME_EVENT: give_item seal_of_passage
```

**`AI_HINT`** — indica que a IA deve enriquecer essa linha. O contexto após
`:` é passado ao Narrator. O texto base sempre aparece se a IA falhar.

**`GAME_EVENT`** — dispara evento no jogo. Formatos:

- `give_item {item_id}` — dá item ao jogador
- `unlock_fragment {fragment_id}` — desbloqueia fragmento de lore
- `set_flag {flag_name}` — seta flag booleana
- `moral_change {+1/-2}` — altera moral score
- `give_gold {amount}` — dá gold

### Exemplo completo — encontro curto

```ink
=== morrigan_greeting ===
// Sempre checkar alinhamento com STORY.md antes de escrever

Um balcão no meio da rua. Sem paredes. Ela limpa um copo
que não precisa ser limpo. # AI_HINT: morrigan tavern no walls, golden light, surreal normal

"Sabia que você ia aparecer hoje", ela diz.

* ["Como sabia?"]
    "Sempre sei." Ela serve algo sem perguntar o que você quer.
    "Vai precisar disso depois." # AI_HINT: morrigan serving drink unprompted, casual certainty
    # GAME_EVENT: give_item morrigans_brew
    -> END

* [Sentar em silêncio]
    Ela não se importa. Serve de qualquer jeito.
    # GAME_EVENT: give_item morrigans_brew
    -> END

* ["Não tenho tempo."]
    ~ moral_score = moral_score - 1
    "Todo mundo diz isso." Ela não parece ofendida.
    "A bebida vai estar aqui quando você voltar."
    -> END
```

### Boas práticas para scripts Ink

**Faça:**

- Verificar `STORY.md` antes de escrever qualquer cena
- Usar variáveis para criar respostas contextuais (`{ moral_score < -3: ... }`)
- Manter texto base funcional e atmosférico mesmo sem IA
- `AI_HINT` em linhas de descrição de ambiente e reações emotivas
- `GAME_EVENT` para qualquer mudança mecânica (itens, flags, moral)
- Knot IDs descritivos: `brennan_passage_granted`, não `scene_4b`

**Evite:**

- Contradizer lore estabelecido em `STORY.md`
- Revelar twists cedo demais (verificar ordem de fragmentos)
- Texto que só funciona com IA — base deve ser completa
- Lógica de jogo em Ink — use `GAME_EVENT` e deixe o código tratar
- Escolhas com resposta "certa" óbvia — zona cinzenta sempre
