const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  watchFolders: [],
  resolver: {
    blockList: [
      /node_modules\/.*\/android\/.cxx\/.*/,
      /node_modules\/.*\/android\/build\/.*/,
    ],
  },
  server: {
    port: 8082,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
