export type LocaleId = 'en' | 'pt-br';

export type Translations = {
  readonly title: {
    readonly prompt: string;
    readonly changeLanguageHint: string;
    readonly languageSelection: string;
    readonly backHint: string;
  };
  readonly intro: {
    readonly paragraphs: readonly string[];
    readonly continuePrompt: string;
  };
  readonly characterCreation: {
    readonly title: string;
    readonly placeholder: string;
  };
};
