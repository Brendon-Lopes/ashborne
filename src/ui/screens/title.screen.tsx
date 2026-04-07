import { type ReactElement } from 'react';
import { Box, Text } from 'ink';

import { AsciiBorder } from '@ui/components/ascii-border.component';
import { TITLE_ART, PROMPT_TEXT } from '@ui/constants/title.constants';

export function TitleScreen(): ReactElement {
  const titleText = TITLE_ART.join('\n');

  return (
    <Box flexDirection="column" flexGrow={1} alignItems="center" justifyContent="center">
      <AsciiBorder padding={2}>{titleText}</AsciiBorder>
      <Text>{'\n'}</Text>
      <Text dimColor> {PROMPT_TEXT} </Text>
    </Box>
  );
}
