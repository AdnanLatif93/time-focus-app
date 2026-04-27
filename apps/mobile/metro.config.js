const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..', '..');

const config = {
  projectRoot,
  watchFolders: [workspaceRoot],
  resolver: {
    // apps/mobile/node_modules FIRST — prevents workspace hoisting issues
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    // Force critical packages to resolve from local node_modules
    extraNodeModules: new Proxy(
      {
        'jest-worker':  path.resolve(projectRoot, 'node_modules/jest-worker'),
        'react':        path.resolve(projectRoot, 'node_modules/react'),
        'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
      },
      {
        get: (target, name) =>
          name in target
            ? target[name]
            : path.join(projectRoot, 'node_modules', name),
      }
    ),
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
