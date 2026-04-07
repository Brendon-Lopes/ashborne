import { type ReactElement } from 'react';
import { Box, Text, useStdout } from 'ink';
import { AsciiBorder } from '@ui/components/ascii-border.component';
import { TITLE_ART, PROMPT_TEXT } from '@ui/constants/title.constants';

export function TitleScreen(): ReactElement {
  const { stdout } = useStdout();
  const terminalRows = stdout?.rows ?? 24;
  const terminalColumns = stdout?.columns ?? 80;

  const titleText = TITLE_ART.join('\n');

  return (
    <Box flexDirection="column" width={terminalColumns} height={terminalRows} backgroundColor="black">
      <Box flexDirection="column" flexGrow={1} alignItems="center" justifyContent="center">
        <AsciiBorder padding={2}>{titleText}</AsciiBorder>
        <Text>{'\n'}</Text>
        <Text dimColor> {PROMPT_TEXT} </Text>
      </Box>
    </Box>
  );
}
