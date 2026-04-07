import { type ReactElement } from 'react';
import { Box, Text } from 'ink';

import { AsciiBorder } from '@ui/components/ascii-border.component';
import { useLocale } from '@ui/hooks/use-locale.hook';

export function CharacterCreationScreen(): ReactElement {
  const t = useLocale();

  return (
    <Box flexDirection="column" flexGrow={1} alignItems="center" justifyContent="center">
      <AsciiBorder>{t.characterCreation.title}</AsciiBorder>
      <Text>{'\n'}</Text>
      <Text dimColor>{t.characterCreation.placeholder}</Text>
    </Box>
  );
}
