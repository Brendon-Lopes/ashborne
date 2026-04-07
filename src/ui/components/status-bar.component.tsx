import { type ReactElement } from 'react';
import { Box, Text } from 'ink';

type StatusBarProps = {
  readonly message?: string | undefined;
};

export function StatusBar({ message }: StatusBarProps): ReactElement {
  return (
    <Box height={1} width="100%">
      {message !== undefined
        ? <Text dimColor color="white">{message}</Text>
        : <Text>{' '}</Text>
      }
    </Box>
  );
}
