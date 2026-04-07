import { useState, useCallback, type ReactElement } from 'react';

import { TitleScreen } from '@ui/screens/title.screen';
import { IntroScreen } from '@ui/screens/intro.screen';
import { CharacterCreationScreen } from '@ui/screens/character-creation.screen';

type Screen = 'title' | 'intro' | 'character-creation';

export function App(): ReactElement {
  const [screen, setScreen] = useState<Screen>('title');

  const handleTitleStart = useCallback((): void => {
    setScreen('intro');
  }, []);

  const handleIntroContinue = useCallback((): void => {
    setScreen('character-creation');
  }, []);

  switch (screen) {
    case 'title':
      return <TitleScreen onStart={handleTitleStart} />;
    case 'intro':
      return <IntroScreen onContinue={handleIntroContinue} />;
    case 'character-creation':
      return <CharacterCreationScreen />;
  }
}
