export type ColorPreset = "blue" | "green" | "indigo" | "seaGreen" ;

export type Contrast = "normal" | "high";

export type Direction = "ltr" | "rtl";

export type PaletteMode = "dark" | "light";

export interface ThemeConfig {
  colorPreset?: ColorPreset;
  contrast?: Contrast;
  direction?: Direction;
  paletteMode?: PaletteMode;
  responsiveFontSizes?: boolean;
  disableButtonsOnLoginAs?: boolean;
}
