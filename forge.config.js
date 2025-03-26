const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer/js/pages/index.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
            {
              html: './src/renderer/html/modal/form.html',
              js: './src/renderer/js/pages/modal/form.js',
              name: 'form',
              preload: {
                js: './src/preload.js',
              },
            },
            {
              html: './src/renderer/html/modal/formdocument.html',
              js: './src/renderer/js/pages/modal/formdocument.js',
              name: 'formdocument',
              preload: {
                js: './src/preload.js',
              },
            },
            {
              html: './src/renderer/html/employees.html',
              js: './src/renderer/js/pages/employees.js',
              name: 'employees',
              preload: {
                js: './src/preload.js',
              },
            },
            {
              html: './src/renderer/html/employees/edit.html',
              js: './src/renderer/js/pages/employees/edit.js',
              name: 'editemployees',
              preload: {
                js: './src/preload.js',
              },
            },
            {
              html: './src/renderer/html/employees/course.html',
              js: './src/renderer/js/pages/employees/course.js',
              name: 'courseemployees',
              preload: {
                js: './src/preload.js',
              },
            },
            {
              html: './src/renderer/html/companies.html',
              js: './src/renderer/js/pages/companies.js',
              name: 'companies',
              preload: {
                js: './src/preload.js',
              },
            },
            {
              html: './src/renderer/html/companies/edit.html',
              js: './src/renderer/js/pages/companies/edit.js',
              name: 'editcompanies',
              preload: {
                js: './src/preload.js',
              },
            },
            {
              html: './src/renderer/html/companies/createdocument.html',
              js: './src/renderer/js/pages/companies/createdocument.js',
              name: 'createdocument',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
