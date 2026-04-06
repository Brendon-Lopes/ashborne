import { type ReactElement } from 'react';
import { Text } from 'ink';

type AsciiBorderProps = {
  readonly title?: string;
  readonly children: string;
};

export function AsciiBorder({ title, children }: AsciiBorderProps): ReactElement {
  const lines = children.split('\n');
  const contentWidth = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const titleWidth = title ? title.length + 1 : 0;
  const width = Math.max(contentWidth + 2, titleWidth + 2);

  const topLine = title ? '+' + title + ' '.repeat(width - title.length - 1) + '+' : '+' + '-'.repeat(width) + '+';

  const bottomLine = '+' + '-'.repeat(width) + '+';

  const allLines = [topLine, ...lines.map((line) => '| ' + line.padEnd(width - 2) + ' |'), bottomLine];

  const output = allLines.join('\n');

  return <Text>{output}</Text>;
}
