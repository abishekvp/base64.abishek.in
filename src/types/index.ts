export type ActiveTab = 'text' | 'file' | 'decode-file' | 'hex' | 'uri';

export interface FileData {
  name: string;
  mime: string;
  size: number;
  rawB64: string;
  dataUri: string;
}

export type TextCharset = 'utf-8' | 'ascii' | 'latin1';
export type TextVariant = 'standard' | 'urlsafe';
export type TextPadding = 'pad' | 'nopad';
export type TextLineBreak = 'none' | '64' | '76';
