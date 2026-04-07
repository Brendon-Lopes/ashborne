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
  // innerWidth = the number of characters between the two '|' delimiters (including side padding)
  const innerWidth = Math.max(contentWidth + padding * 2, title ? title.length + 2 : 0);

  const topLine = title
    ? '+' + title + '='.repeat(innerWidth - title.length - 1) + '+'
    : '+' + '='.repeat(innerWidth) + '+';

  const bottomLine = '+' + '='.repeat(innerWidth) + '+';

  const emptyLine = '|' + ' '.repeat(innerWidth) + '|';

  const contentLines = lines.map((line) => {
    const padLeft = ' '.repeat(padding);
    const padRight = ' '.repeat(innerWidth - padding - line.length);
    return '|' + padLeft + line + padRight + '|';
  });

  const allLines = [
    topLine,
    ...Array<string>(padding).fill(emptyLine),
    ...contentLines,
    ...Array<string>(padding).fill(emptyLine),
    bottomLine,
  ];

  return <Text>{allLines.join('\n')}</Text>;
}
