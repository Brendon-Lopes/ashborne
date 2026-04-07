import { render } from 'ink';

import { GameLayout } from '@ui/components/game-layout.component';
import { LocaleProvider } from '@ui/hooks/use-locale.hook';
import { App } from '@ui/app.component';

render(
  <LocaleProvider locale="en">
    <GameLayout>
      <App />
    </GameLayout>
  </LocaleProvider>,
  { exitOnCtrlC: false },
);
