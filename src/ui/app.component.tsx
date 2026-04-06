import { type ReactElement } from 'react';
import { Text } from 'ink';
import chalk from 'chalk';

export function App(): ReactElement {
  return <Text>{chalk.green('Hello, Ashborne!')}</Text>;
}
