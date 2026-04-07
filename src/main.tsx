import { render } from 'ink';

import { GameLayout } from '@ui/components/game-layout.component';
import { LocaleProvider } from '@ui/hooks/use-locale.hook';
import { App } from '@ui/app.component';

const { waitUntilExit } = render(
  <LocaleProvider locale="en">
    <GameLayout>
      <App />
    </GameLayout>
  </LocaleProvider>,
  { exitOnCtrlC: false },
);

void waitUntilExit().then(() => {
  process.stdout.write('\x1B[2J\x1B[H\x1B[3J');
});
