import { type ReactElement, useEffect, useState } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import { AsciiBorder } from '@ui/components/ascii-border.component';
import { TITLE_ART, PROMPT_TEXT, BLINK_INTERVAL } from '@ui/constants/title.constants';

type TitleScreenProps = {
  readonly onContinue?: () => void;
};

export function TitleScreen({ onContinue }: TitleScreenProps): ReactElement {
  const [visible, setVisible] = useState(true);
  const { stdout } = useStdout();
  const terminalRows = stdout?.rows ?? 24;
  const terminalColumns = stdout?.columns ?? 80;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev);
    }, BLINK_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useInput(() => {
    onContinue?.();
  });

  const titleText = TITLE_ART.join('\n');

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width={terminalColumns}
      height={terminalRows}
      backgroundColor="black"
    >
      <AsciiBorder padding={2}>{titleText}</AsciiBorder>
      <Text>{'\n'}</Text>
      <Text dimColor>
        {visible ? '>' : ' '} {PROMPT_TEXT} {visible ? '<' : ' '}
      </Text>
    </Box>
  );
}
