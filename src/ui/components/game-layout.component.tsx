import { type ReactElement, type ReactNode } from 'react';
import { Box, useStdout } from 'ink';

import { StatusBar } from '@ui/components/status-bar.component';
import { useExitConfirmation } from '@ui/hooks/use-exit-confirmation.hook';

const EXIT_MESSAGE = 'Press Ctrl+C again to exit';

type GameLayoutProps = {
  readonly children: ReactNode;
};

export function GameLayout({ children }: GameLayoutProps): ReactElement {
  const { stdout } = useStdout();
  const terminalRows = stdout?.rows ?? 24;
  const terminalColumns = stdout?.columns ?? 80;

  const { pendingExit } = useExitConfirmation();

  return (
    <Box
      flexDirection="column"
      width={terminalColumns}
      height={terminalRows}
      backgroundColor="black"
    >
      <Box flexGrow={1} flexDirection="column">
        {children}
      </Box>
      <StatusBar message={pendingExit ? EXIT_MESSAGE : undefined} />
    </Box>
  );
}
