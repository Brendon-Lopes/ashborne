import { type ReactElement, useState, useCallback } from 'react';
import { Box, Text } from 'ink';
import { useInput } from 'ink';

import { LOCALE_LIST, getLocaleByKey } from '@config/locales/locales.config';
import { AsciiBorder } from '@ui/components/ascii-border.component';
import { TITLE_ART } from '@ui/constants/title.constants';
import { useLocale } from '@ui/hooks/use-locale.hook';

type TitleScreenProps = {
  readonly onStart: () => void;
};

export function TitleScreen({ onStart }: TitleScreenProps): ReactElement {
  const { t, localeId, setLocale } = useLocale();
  const [showLanguages, setShowLanguages] = useState(false);

  const titleText = TITLE_ART.join('\n');

  const handleSelectLanguage = useCallback((): void => {
    setShowLanguages(true);
  }, []);

  const handleCancelLanguageSelection = useCallback((): void => {
    setShowLanguages(false);
  }, []);

  useInput((input, key) => {
    if (key.ctrl) {
      return;
    }

    if (showLanguages) {
      if (input === 'q' || key.escape) {
        handleCancelLanguageSelection();
        return;
      }
      const selected = getLocaleByKey(input);
      if (selected !== undefined) {
        setLocale(selected);
        handleCancelLanguageSelection();
      }
      return;
    }

    if (input === 'l') {
      handleSelectLanguage();
      return;
    }

    onStart();
  });

  return (
    <Box flexDirection="column" flexGrow={1} alignItems="center" justifyContent="center">
      <AsciiBorder padding={2}>{titleText}</AsciiBorder>
      <Text>{'\n'}</Text>
      <Text> {t.title.prompt} </Text>
      <Text>{'\n'}</Text>
      <Text dimColor> {t.title.changeLanguageHint}</Text>

      {showLanguages && (
        <Box marginTop={1} flexDirection="column" alignItems="center">
          <Text bold> {t.title.languageSelection} </Text>
          {LOCALE_LIST.map((lang) => {
            const isActive = lang.id === localeId;
            const content = `${lang.key}. ${lang.label}${isActive ? ' ✓' : ''}`;
            return (
              <Text key={lang.id} {...(isActive ? { color: 'green' } : {})}>
                {content}
              </Text>
            );
          })}
          <Text dimColor> {t.title.backHint}</Text>
        </Box>
      )}
    </Box>
  );
}
