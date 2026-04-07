# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

---

## [0.2.0] — 2026-04-07

### Added

- **Tela de título** com arte ASCII e interação "pressione qualquer tecla"
- **Tela de introdução** com narrativa e prompt de continuação
- **Tela de criação de personagem** com seleção de classe
- **Sistema de localização (i18n)** com detecção automática do idioma do sistema via `Intl`
- **Suporte a dois idiomas**: português brasileiro (`pt-br`) e inglês (`en`)
- **Troca de idioma na tela de título** — menu numérico dinâmico com `LOCALE_LIST`
- **Confirmação de saída** com `Ctrl+C` (duplo pressionar com timeout de 1s)
- **Limpeza do terminal ao sair** do jogo
- **Componente `AsciiBorder`** com padding e título opcional
- **Componente `HpBar`** para barra de vida estilo ASCII
- **Componente `AsciiMenu`** para menus interativos
- **Componente `StatusBar`** para mensagens de rodapé
- **Componente `GameLayout`** como container principal com status bar
- **Hook `useLocale`** com contexto React, `localeId` e `setLocale`
- **Hook `usePressAnyKey`** para avanço por qualquer tecla
- **Hook `useExitConfirmation`** para confirmação de saída
- **Utilitário `detectLocale`** para detecção automática via `Intl.NumberFormat`
- **Configurações de locale** em `src/config/locales/` (en, pt-br)
- **Constantes de título** com arte ASCII do nome do jogo
- **Aliases `@game/*` e `@narrative/*`** no `tsconfig.json` e `vite.config.ts`

### Changed

- **`LocaleProvider`** agora detecta idioma automaticamente (sem parâmetro obrigatório)
- **`main.tsx`** usa `waitUntilExit` para limpeza pós-unmount do Ink
