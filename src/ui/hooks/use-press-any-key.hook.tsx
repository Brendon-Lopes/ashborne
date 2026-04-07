import { useInput } from 'ink';

export function usePressAnyKey(onPress: () => void): void {
  useInput((_input, key) => {
    if (key.ctrl) {
      return;
    }
    onPress();
  });
}
