import { type ReactElement } from 'react';
import { Box, Text } from 'ink';

import { useLocale } from '@ui/hooks/use-locale.hook';
import { usePressAnyKey } from '@ui/hooks/use-press-any-key.hook';

type IntroScreenProps = {
  readonly onContinue: () => void;
};

export function IntroScreen({ onContinue }: IntroScreenProps): ReactElement {
  const t = useLocale();

  usePressAnyKey(onContinue);

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      paddingX={4}
    >
      {t.intro.paragraphs.map((paragraph, index) => (
        <Box key={index} marginBottom={1}>
          <Text>{paragraph}</Text>
        </Box>
      ))}
      <Box marginTop={1}>
        <Text dimColor>{t.intro.continuePrompt}</Text>
      </Box>
    </Box>
  );
}
