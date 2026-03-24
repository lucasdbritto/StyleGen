export interface ColorInfo {
  name: string;
  hex: string;
  usage: string;
}

export interface StyleGuide {
  toneOfVoice: {
    style: string;
    examples: string[];
  };
  colorPalette: ColorInfo[];
  typography: {
    headings: {
      name: string;
      justification: string;
    };
    body: {
      name: string;
      justification: string;
    };
  };
  layout: {
    style: string;
    buttons: string;
    cardsAndNav: string;
  };
  designRationale: string;
}

export interface ArchivedGuide extends StyleGuide {
  id: string;
  name: string;
  date: string;
  status: 'Publicado' | 'Rascunho';
}

export type Page = 'dashboard' | 'templates' | 'archives';
