# DESIGN.md — Game Design Document

---

## Visão geral

Ashborne é um RPG roguelite de terminal com combate D&D por turnos,
narrativa gerada por IA e meta-progressão focada em revelação de lore.
Cada run dura 30-60 minutos. O jogo é completo em ~7-10 runs para
um jogador que explora o lore ativamente.

---

## Loop de jogo

```
Run
 └── Escolher classe
      └── Atravessar Ashborne (6 regiões)
           └── Por região:
                ├── Navegar pelos pontos de interesse
                ├── Resolver encontros (combate / evento / descanso / loja)
                ├── Derrotar o guardião da região (boss)
                └── Subir de nível
      └── Morrer ou vencer
           └── Epitáfio + fragmento de lore
                └── Meta-progressão atualizada
                     └── Nova run
```

---

## Criação de Personagem

Simples e rápida — três telas, sem distribuição manual de pontos.
A classe define tudo. A customização vem com o tempo, via level up.

### Fluxo

```
Tela 1 — Escolha de classe
Tela 2 — Nome do herói
Tela 3 — Confirmação + prólogo da IA → jogo começa
```

### Tela 1 — Escolha de classe

Cada classe exibe: nome, descrição narrativa curta, e barras visuais
dos atributos principais. O jogador digita `1`, `2` ou `3`.

```
+===============[ ASHBORNE ]================+
|                                           |
|         "Mais um.", diz o cachorro.       |
|                                           |
+-------------------------------------------+
|  Quem você foi, antes de chegar aqui?     |
+-------------------------------------------+
|                                           |
|  [1]  GUERREIRO                           |
|       Carrega cicatrizes que não lembra   |
|       como ganhou. Avança porque parar    |
|       parece mais perigoso.               |
|                                           |
|       FOR ████████░░  DEX █████░░░░░      |
|       CON ████████░░  INT ███░░░░░░░      |
|                                           |
+-------------------------------------------+
|  [2]  MAGO                                |
|       Ouve sussurros numa língua que      |
|       predateia a fala humana.            |
|       Ainda responde.                     |
|                                           |
|       FOR ███░░░░░░░  DEX █████░░░░░      |
|       CON ███░░░░░░░  INT ██████████      |
|                                           |
+-------------------------------------------+
|  [3]  ARQUEIRO                            |
|       Segue um rastro de cinzas há mais   |
|       tempo do que consegue lembrar.      |
|       Não sabe o que encontrará no fim.   |
|                                           |
|       FOR █████░░░░░  DEX ██████████      |
|       CON █████░░░░░  INT ████░░░░░░      |
|                                           |
+-------------------------------------------+
| > _                                       |
+-------------------------------------------+
```

### Tela 2 — Nome

```
+===============[ ASHBORNE ]================+
|                                           |
|  Um GUERREIRO.                            |
|                                           |
|  O mundo não vai lembrar do seu nome.     |
|  Mas você vai carregar ele até o fim.     |
|                                           |
+-------------------------------------------+
|  Como você se chama?                      |
|                                           |
|  > Aldric_                                |
|                                           |
|  [ENTER] confirmar                        |
|  [ENTER em branco] nome aleatório         |
+-------------------------------------------+
```

### Tela 3 — Confirmação

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

Ao confirmar, a IA gera o prólogo do herói e o jogo começa.

---

## Atributos

Seis atributos D&D clássicos. Calculados automaticamente pela classe.
Modifier = `Math.floor((valor - 10) / 2)`.

| Atributo     | Abrev. | Afeta                                        |
| ------------ | ------ | -------------------------------------------- |
| Força        | FOR    | Dano corpo a corpo, capacidade de carga      |
| Destreza     | DEX    | Dano à distância, iniciativa, esquiva        |
| Constituição | CON    | HP máximo, resistência a status effects      |
| Inteligência | INT    | Poder mágico, slots de feitiço               |
| Sabedoria    | SAB    | Percepção, resistir aos "empurrões" da Força |
| Carisma      | CAR    | Respostas de NPCs, ramificações de diálogo   |

**SAB é o atributo narrativamente mais importante** — é o que resiste
à influência da Entidade. Jogadores com SAB alta percebem anomalias antes.
Isso nunca é explicado diretamente ao jogador.

### Atributos iniciais por classe

| Atributo    | Guerreiro | Mago    | Arqueiro |
| ----------- | --------- | ------- | -------- |
| FOR         | 14 (+2)   | 8 (-1)  | 10 (+0)  |
| DEX         | 10 (+0)   | 10 (+0) | 16 (+3)  |
| CON         | 14 (+2)   | 8 (-1)  | 12 (+1)  |
| INT         | 8 (-1)    | 16 (+3) | 8 (-1)   |
| SAB         | 10 (+0)   | 12 (+1) | 12 (+1)  |
| CAR         | 8 (-1)    | 10 (+0) | 10 (+0)  |
| **HP**      | **50**    | **35**  | **45**   |
| **Energia** | **5**     | **8**   | **6**    |

### Progressão de atributos

Ao subir de nível (uma vez por região), o jogador escolhe **+3 num atributo**.
Uma decisão por level up. Sem mais opções — simplicidade é intencional.

```
Nível 2 — escolha: +3 FOR, +3 CON, ou +3 DEX
```

O HP máximo também sobe automaticamente ao subir de nível:

- Guerreiro: +8 HP por nível
- Mago: +4 HP por nível
- Arqueiro: +6 HP por nível

---

## Classes

### Guerreiro

**Fantasia:** Tanque que absorve dano e controla o campo de batalha.
**Atributo principal:** FOR (dano) + CON (HP)
**HP base:** 50 | **Energia base:** 5

**Habilidades iniciais:**

- _Golpe Pesado_ (2 energia) — d8+FOR, chance de atordoar (d20 vs CON inimigo)
- _Postura Defensiva_ (1 energia) — próximo ataque recebido reduzido em 50%
- _Grito de Guerra_ (3 energia) — +2 dano em todos os ataques por 3 turnos
- _Resiliência_ (passiva) — quando HP < 25%, regenera 3 HP por turno

**Identidade mecânica:** Sobrevive mais, controla o ritmo do combate.
É o mais fácil de aprender mas requer decisões de quando defender vs. atacar.

---

### Mago

**Fantasia:** Alto dano, frágil, recursos limitados. Cada feitiço cobra um preço.
**Atributo principal:** INT (poder mágico) + SAB (controle)
**HP base:** 35 | **Energia base:** 8

**Habilidades iniciais:**

- _Chama Cinzenta_ (3 energia) — d10+INT, aplica burning(2t, magnitude 3)
- _Véu de Névoa_ (2 energia) — próximo ataque tem 50% de chance de errar
- _Drenagem_ (4 energia) — d6+INT dano, recupera metade como HP
- _Eco Arcano_ (passiva) — cada 3 feitiços lançados, o próximo custa 0 energia

**Identidade mecânica:** Maior dano por turno, menor margem de erro.
Gerenciar energia é mais crítico que no Guerreiro.

---

### Arqueiro

**Fantasia:** Distância, mobilidade, sangramento. Vence desgastando.
**Atributo principal:** DEX (precisão e esquiva) + SAB (percepção)
**HP base:** 45 | **Energia base:** 6

**Habilidades iniciais:**

- _Flecha Perfurante_ (2 energia) — d6+DEX, ignora 2 pontos de armadura
- _Flecha Envenenada_ (3 energia) — d4+DEX, aplica poison(3t, magnitude 4)
- _Recuar_ (1 energia) — próximo ataque recebido tem -3 de dano (distância)
- _Olho Afiado_ (passiva) — primeiro ataque de cada combate tem vantagem

**Identidade mecânica:** Dano por tempo (DoT) acumulado. Vence combates
longos. Fraco em burst. Posicionamento e ordem de habilidades importam.

---

## Combate

### Estrutura de um turno

```
1. [Inimigo mostra intenção] — o jogador sabe o que vem
2. [Jogador escolhe ação]
3. [Ação do jogador resolvida]
4. [Ação do inimigo resolvida]
5. [Tick de status effects]
6. [Verificar vitória/derrota]
```

### Intenções do inimigo

Cada inimigo tem um conjunto de ações com pesos de probabilidade.
O jogo mostra qual ação o inimigo _pretende_ executar no próximo turno.
Isso cria decisões estratégicas: defender quando vai apanhar forte,
atacar agressivamente quando inimigo vai curar.

### Economia de energia

- Energia restaurada completamente a cada combate
- Dentro do combate, alguns itens/habilidades restauram energia
- Sem energia = só ação básica disponível (d4, sem modificador)

### Dificuldade por região

| Região | Tipo de inimigo     | HP médio inimigo | Mecânica nova       |
| ------ | ------------------- | ---------------- | ------------------- |
| 1      | Fracos, sem effects | 20-30            | Combate básico      |
| 2      | Médios, 1 effect    | 35-45            | Status effects      |
| 3      | Boss 1              | 80               | Intenções complexas |
| 4      | Difíceis, 2 effects | 50-65            | Multi-phase?        |
| 5      | Elites              | 70-90            | Mecânica especial   |
| 6      | Boss final          | 120+             | Fases múltiplas     |

---

## Mundo — Regiões de Ashborne

### Princípio fundamental

O jogador nunca deve sentir que está passando por caixas desconectadas. A exceção são
locais explicitamente fechados (cavernas, porões, edifícios específicos) — e
esses são exceção intencional, usada para criar contraste claustrofóbico com
o mundo aberto lá fora.

A estrutura técnica continua sendo um grafo de nós conectados — mas a
apresentação, nomenclatura e narrativa são as de um mundo real que o jogador
está atravessando.

### As seis regiões

| Região              | Tom                                | Tipo de espaço                        |
| ------------------- | ---------------------------------- | ------------------------------------- |
| **Os Arredores**    | Abandono tranquilo, luz dourada    | Campos abertos, estrada               |
| **A Cidade Baixa**  | Vazio urbano, casas sem gente      | Ruas, mercado, praças                 |
| **O Convento**      | Primeiro espaço fechado de verdade | Interior — claustrofóbico intencional |
| **As Catacumbas**   | Escuridão, geometria impossível    | Subterrâneo — fechado intencional     |
| **O Distrito Alto** | Grandiosidade deteriorada          | Avenidas largas, mansões abertas      |
| **O Centro**        | Onde algo ainda pulsa              | Indefinível — espaço que não obedece  |

Locais fechados (Convento, Catacumbas) são usados estrategicamente para
criar contraste com o mundo aberto — o jogador sente a diferença.

### Pontos de interesse

Cada região tem 6-9 pontos de interesse. O jogador se move entre eles como
se estivesse atravessando um lugar real. Cada ponto tem nome evocativo e
descrição que sugere que o mundo continua além dele.

Exemplo — Os Arredores:

```
  a estrada velha . . . . a fazenda abandonada
          \                      /
           \                    /
        o poço seco . . . a encruzilhada
                                \
                           [ o portão da cidade ]
```

Tipos de ponto de interesse:

| Tipo       | Apresentação no mundo                                            |
| ---------- | ---------------------------------------------------------------- |
| `combat`   | Encontro num local específico — emboscada, criatura territorial  |
| `event`    | Algo ou alguém num lugar — NPC, objeto, situação                 |
| `rest`     | Local com condições de parar — ruína coberta, fonte, fogueira    |
| `shop`     | Mercador que sempre está lá — sem explicação de por quê          |
| `boss`     | Destino da região — o que guarda a passagem para o próximo lugar |
| `entrance` | Ponto de chegada do jogador — sempre com descrição de orientação |

### Transições narrativas

Em vez de "você chega no próximo ponto", o texto descreve o deslocamento.
A IA gera a transição com base na região e no destino:

> _Você segue pela estrada velha até o que foi um mercado. As bancas ainda
> estão montadas. Ninguém as desmontou porque ninguém voltou para fazer isso._

O combate e os eventos acontecem **naquele lugar** — não numa arena separada.
A descrição do local é parte do encontro.

### Mapa no terminal

O mapa usa pontos e traços em vez de boxes — sugere esboço topográfico,
não planta baixa:

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

Pontos visitados mostram nome completo. Pontos não visitados mostram `?`
ou nome parcial — o jogador sabe que há algo lá, não o quê.

### Escolha de rota

O jogador vê o grafo completo da região atual mas não sabe o conteúdo dos
pontos não visitados (exceto o boss e a entrada). Tipo revelado ao chegar.
Isso cria tensão: o caminho mais curto pode ter mais encontros.

### Loja — itens disponíveis (exemplos)

| Item                | Custo | Efeito                         |
| ------------------- | ----- | ------------------------------ |
| Poção de Cura Menor | 30g   | Recupera 15 HP                 |
| Poção de Cura Maior | 70g   | Recupera 35 HP                 |
| Pedra de Afiar      | 40g   | +2 dano no próximo combate     |
| Antídoto            | 25g   | Remove poison/bleeding/burning |
| Tomo Cinzento       | 80g   | +5 XP bônus                    |

---

## Sistema Moral

### Como funciona

Cada escolha em evento tem `moralWeight` de -2 a +2.
O `moralScore` acumula durante a run (começa em 0).

### Efeitos do moral score

| Score   | Categoria | Efeito narrativo                                      |
| ------- | --------- | ----------------------------------------------------- |
| > +5    | Nobre     | Narrator usa tom mais esperançoso (raro em Ashborne)  |
| -3 a +3 | Cinza     | Tom padrão — ambíguo                                  |
| < -5    | Sombrio   | Narrator aumenta tom de horror, NPCs reagem diferente |

**Importante:** Não há penalidade mecânica por escolhas "sombrias".
Não há "alinhamento" visível para o jogador.
O impacto é narrativo e sutil — o mundo reage, não pune.

### Exemplos de peso moral

- Salvar uma criança inocente com risco: +2
- Ignorar pedido de ajuda: -1
- Matar inimigo rendido por conveniência: -2
- Sacrificar item valioso para aliviar sofrimento de NPC: +1
- Mentir para obter vantagem: -1
- Revelar verdade cruel mas necessária: 0 (neutro — é complexo)

---

## Meta-progressão

### O Arquivo

Menu acessível entre runs. Contém:

- Epitáfios de todos os heróis mortos (gerados por IA)
- Fragmentos de lore desbloqueados
- Estatísticas gerais (runs, regiões, inimigos, etc.)

### Desbloqueios por marcos

| Marco                           | Desbloqueio                            |
| ------------------------------- | -------------------------------------- |
| Run 1 completada (qualquer fim) | Fragmento de lore #3                   |
| Primeiro boss derrotado         | Fragmento de lore #4                   |
| Mago desbloqueado (3 runs)      | Fragmento de lore #5                   |
| Distrito Alto alcançado         | Fragmento de lore #8                   |
| Vitória (qualquer)              | Fragmento de lore #9                   |
| Vitória secreta                 | Fragmento de lore #10 + fim verdadeiro |

### Bônus permanentes (pequenos, não pay-to-win)

- +2 HP inicial (após 5 runs)
- +1 gold inicial (após 3 runs)
- Ver tipo de ponto de interesse antes de entrar (após 10 runs — conforto de qualidade de vida)

### Herói morto deixa relic

- 20% de chance de uma run deixar uma relic
- Relic tem nome baseado no herói + lore gerado pelo epitáfio
- Aparece num ponto de interesse específico de run futura como item especial

---

## Economia

### Gold

- Ganho em combates (5-15g por inimigo comum, 30-50g por boss)
- Ganho em alguns eventos
- Gasto na loja
- Não persiste entre runs (exceto bônus de meta-progressão mínimo)

### XP e level

- XP por combate e por alguns eventos
- Level up a cada ~100 XP (por região)
- Level máximo por run: 6 (um por região)
- Ao subir de nível: escolha de +3 num atributo (uma única opção)

---

## Feedback ao jogador

### O que é sempre visível

- HP e energia do herói
- HP do inimigo
- Status effects ativos (ambos)
- Intenção do inimigo no próximo turno
- Ações disponíveis com custo de energia

### O que é revelado gradualmente

- Tipo de ponto de interesse (ao chegar)
- Lore do inimigo (após derrotá-lo pela primeira vez)
- Fragmentos de lore (via eventos e O Arquivo)
- A verdade sobre o ciclo (nunca diretamente)

### O que nunca é revelado pelo jogo

- O que a Entidade é
- Quantos ciclos ocorreram
- O nome verdadeiro de vários personagens
- Se o jogador está "ganhando" ou "perdendo" no sentido cósmico
