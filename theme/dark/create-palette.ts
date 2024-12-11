
import { alpha } from "@mui/material";
import type { PaletteOptions } from "@mui/material/styles/createPalette";

import { error, info, neutral, success, warning } from "@root/theme/colors";
import { getPrimary } from "@root/theme/utils";
import type { ColorPreset, Contrast } from "@types";

interface Config {
  colorPreset?: ColorPreset;
  contrast?: Contrast;
}

export const createPalette = (config: Config): PaletteOptions => {
  const { colorPreset, contrast } = config;

  return {
    common: {
      white: "#fff",
      black: "#000",
    },
    action: {
      active: neutral[500],
      disabled: alpha(neutral[100], 0.38),
      disabledBackground: alpha(neutral[100], 0.12),
      focus: alpha(neutral[100], 0.16),
      hover: alpha(neutral[100], 0.04),
      selected: alpha(neutral[100], 0.12),
    },
    background: {
      default: contrast === "high" ? "#0B0F19" : "#0E1320",
      paper: neutral[900],
    },
    divider: "#2D3748",
    error,
    info,
    mode: "dark",
    neutral,
    primary: getPrimary(colorPreset),
    success,
    text: {
      primary: "#EDF2F7",
      secondary: "#A0AEC0",
      disabled: "rgba(255, 255, 255, 0.48)",
    },
    warning,
  };
};