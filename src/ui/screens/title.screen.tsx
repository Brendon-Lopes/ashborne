import { type ReactElement } from 'react';
import { Box, Text } from 'ink';

import { AsciiBorder } from '@ui/components/ascii-border.component';
import { TITLE_ART } from '@ui/constants/title.constants';
import { useLocale } from '@ui/hooks/use-locale.hook';
import { usePressAnyKey } from '@ui/hooks/use-press-any-key.hook';

type TitleScreenProps = {
  readonly onStart: () => void;
};

export function TitleScreen({ onStart }: TitleScreenProps): ReactElement {
  const t = useLocale();

  usePressAnyKey(onStart);

  const titleText = TITLE_ART.join('\n');

  return (
    <Box flexDirection="column" flexGrow={1} alignItems="center" justifyContent="center">
      <AsciiBorder padding={2}>{titleText}</AsciiBorder>
      <Text>{'\n'}</Text>
      <Text dimColor> {t.title.prompt} </Text>
    </Box>
  );
}
