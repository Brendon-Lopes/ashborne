import { render } from 'ink';

import { GameLayout } from '@ui/components/game-layout.component';
import { TitleScreen } from '@ui/screens/title.screen';

render(
  <GameLayout>
    <TitleScreen />
  </GameLayout>,
  { exitOnCtrlC: false },
);
