/** @type {import('tailwindcss').Config} */
import COLORS from "./src/theme/color";
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./src/app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          primary: COLORS.primary,
          secondary: COLORS.secondary,
          tertiary: COLORS.tertiary,
          quaternary: COLORS.quaternary,
          background: COLORS.background,
          card: COLORS.card,
          tint: COLORS.tint,
          success: COLORS.success,
          error: COLORS.error,
        },
        fontFamily: {
          "ozel":["victor-mono"],
          "ozel-italic":["victor-mono-italic"],
          "sans-code":["sans-code"],
          "sans-code-italic":["sans-code-italic"],
          "wenkai-mono-bold":["wenkai-mono-bold"],
          "wenkai-mono-light":["wenkai-mono-light"],
          "wenkai-mono-regular":["wenkai-mono-regular"],
        },
      },
    },
    plugins: [],
  }