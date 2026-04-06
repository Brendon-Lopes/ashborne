import { type ReactElement } from 'react';
import { Text } from 'ink';

const FILLED = '\u2588';
const EMPTY = '\u2591';

type AsciiHealthBarProps = {
  readonly current: number;
  readonly max: number;
  readonly width?: number;
};

export function AsciiHealthBar({ current, max, width = 20 }: AsciiHealthBarProps): ReactElement {
  const ratio = Math.max(0, Math.min(1, current / max));
  const filledCount = Math.round(ratio * width);
  const emptyCount = width - filledCount;

  const bar = FILLED.repeat(filledCount) + EMPTY.repeat(emptyCount);
  const label = `${current}/${max}`;

  return <Text>{`[${bar}] ${label}`}</Text>;
}
