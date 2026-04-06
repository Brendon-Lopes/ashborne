import { type ReactElement } from 'react';
import { Text } from 'ink';

type AsciiBorderProps = {
  readonly title?: string;
  readonly children: string;
  readonly padding?: number;
};

export function AsciiBorder({ title, children, padding = 1 }: AsciiBorderProps): ReactElement {
  const lines = children.split('\n');
  const contentWidth = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const titleWidth = title ? title.length + 1 : 0;
  const width = Math.max(contentWidth + padding * 2, titleWidth + 2);

  const topLine = title
    ? '+' + title + ' '.repeat(width - title.length - 1) + '+'
    : '+' + '-'.repeat(width) + '+';

  const bottomLine = '+' + '-'.repeat(width) + '+';

  const emptyLine = ' '.repeat(width - 2);
  const paddedLines = lines.map((line) => ' '.repeat(padding) + line);

  const allLines = [
    topLine,
    ...Array(padding).fill(emptyLine),
    ...paddedLines,
    ...Array(padding).fill(emptyLine),
    bottomLine,
  ].map((line) => '| ' + line.padEnd(width - 2) + ' |');

  allLines[0] = topLine;
  allLines[allLines.length - 1] = bottomLine;

  const output = allLines.join('\n');

  return <Text>{output}</Text>;
}
