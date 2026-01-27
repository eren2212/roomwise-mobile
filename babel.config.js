// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel", // 🔥 DÜZELTME: Bu artık presets içinde olmalı
    ],
    plugins: [
      "react-native-reanimated/plugin", // Reanimated her zaman en sonda
    ],
  };
};