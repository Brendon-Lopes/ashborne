import { type ReactElement } from 'react';
import { Text, useInput } from 'ink';

type AsciiMenuProps = {
  readonly items: readonly string[];
  readonly selectedIndex: number;
  readonly onIndexChange: (index: number) => void;
  readonly onSelect?: (index: number) => void;
  readonly prefix?: string;
};

export function AsciiMenu({
  items,
  selectedIndex,
  onIndexChange,
  onSelect,
  prefix = '>',
}: AsciiMenuProps): ReactElement {
  useInput((input) => {
    if (input === 'j' || input === 'arrowdown') {
      onIndexChange(Math.min(items.length - 1, selectedIndex + 1));
      return;
    }

    if (input === 'k' || input === 'arrowup') {
      onIndexChange(Math.max(0, selectedIndex - 1));
      return;
    }

    if (input === 'return') {
      onSelect?.(selectedIndex);
    }
  });

  const output = items
    .map((item, index) => {
      const marker = index === selectedIndex ? prefix : ' ';
      return `${marker} ${item}`;
    })
    .join('\n');

  return <Text>{output}</Text>;
}
