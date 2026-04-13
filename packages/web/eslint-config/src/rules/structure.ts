import {
  createFolderStructure,
  projectStructureParser,
  projectStructurePlugin,
} from 'eslint-plugin-project-structure'

import type { LintConfig } from '@/types/lint.type.ts'

const API_FOLDER = {
  name: 'api',
  children: [
    {
      name: '{kebab-case}',
      children: [
        {
          name: 'queries',
          children: [
            {
              name: '{camelCase}.query.ts',
            },
          ],
        },
        {
          name: 'mutations',
          children: [
            {
              name: '{camelCase}.mutation.ts',
            },
          ],
        },
        {
          name: 'services',
          children: [
            {
              name: '{camelCase}.service.ts',
            },
          ],
        },
      ],
    },
  ],
}

const ASSETS_FOLDER = {
  name: 'assets',
  // This allows anything in the folder
  children: [],
}

const CLIENT_FOLDER = {
  name: 'client',
  children: [
    {
      name: '{camelCase}.gen.ts',
    },
    {
      name: 'index.ts',
    },
  ],
}

const COMPONENT_VARIANTS_FOLDER = {
  name: 'components-variants',
  children: [
    {
      name: '{kebab-case}',
      children: [
        {
          name: '{camelCase}.variant.ts',
        },

      ],
    },
    {
      name: 'index.ts',
    },
  ],
}

const COMPONENTS_FOLDER = {
  name: 'components',
  children: [
    {
      ruleId: 'components_folder' as const,
    },
    {
      name: '{PascalCase}.vue|{camelCase}.context.ts|{camelCase}.composable.ts|{camelCase}.type.ts|{camelCase}.test.ts|{camelCase}.spec.ts|{camelCase}.props.ts',
    },

  ],
}

const COMPOSABLES_FOLDER = {
  name: 'composables',
  children: [
    {
      name: '{camelCase}.composable.ts',
    },
    {
      name: '{camelCase}.composable.test.ts|{camelCase}.composable.spec.ts',
    },
    {
      name: '{kebab-case}',
      children: [
        {
          name: '{camelCase}.composable.ts',
        },
        {
          name: '{camelCase}.composable.test.ts|{camelCase}.composable.spec.ts',
        },
        {
          name: '{kebab-case}',
          children: [
            {
              name: '{camelCase}.composable.ts',
            },
            {
              name: '{camelCase}.composable.test.ts|{camelCase}.composable.spec.ts',
            },
          ],
        },
      ],
    },
    {
      name: 'index.ts',
    },
  ],
}

const CONFIGS_FOLDER = {
  name: 'configs',
  children: [
    {
      name: '{camelCase}.config.ts',
    },
  ],
}

const CONSTANTS_FOLDER = {
  name: 'constants',
  children: [
    {
      name: '{camelCase}.constant.ts',
    },
    {
      name: '{kebab-case}',
      children: [
        {
          name: '{folderName}.constant.ts',
        },
      ],
    },
  ],
}

const ICONS_FOLDER = {
  name: 'icons',
  children: [
    {
      name: '{PascalCase}Icon.vue',
    },
    {
      name: 'icons.ts',
    },
  ],
}

const LIBS_FOLDER = {
  name: 'libs',
  children: [
    {
      name: '{camelCase}.lib.ts',
    },
  ],
}

const LOCALES_FOLDER = {
  name: 'locales',
  children: [
    {
      name: '{kebab-case}.json',
    },
  ],
}

const MIDDLEWARES_FOLDER = {
  name: 'middlewares',
  children: [
    {
      name: '{camelCase}.middleware.ts',
    },
  ],
}

const MOCKS_FOLDER = {
  name: 'mocks',
  children: [
    {
      name: '{camelCase}.mock.ts',
    },
    {
      name: '{kebab-case}',
      children: [
        {
          name: '{camelCase}.mock.ts',
        },
        {
          name: 'index.ts',
        },
      ],
    },
  ],
}

const MODELS_FOLDER = {
  name: 'models',
  children: [
    {
      ruleId: 'models_folder' as const,
    },
  ],
}

const PLUGINS_FOLDER = {
  name: 'plugins',
  children: [
    {
      name: '{camelCase}.plugin.ts',
    },

  ],
}

const ROUTES_FOLDER = {
  name: 'routes',
  children: [
    {
      name: 'routes.ts',
    },
    {
      name: '{camelCase}.routes.ts',
    },

  ],
}

const ROUTES_MODULE_FOLDER = {
  name: 'routes',
  children: [
    {
      name: 'routes.ts',
    },
    {
      name: '{camelCase}.routes.ts',
    },

  ],

}

const STORES_FOLDER = {
  name: 'stores',
  children: [
    {
      name: '{camelCase}.store.ts',
    },

  ],
}

const THEMES_FOLDER = {
  name: 'themes',
  children: [
    {
      name: '{camelCase}.json',
    },

  ],
}

const TYPES_FOLDER = {
  name: 'types',
  children: [
    {
      name: '{kebab-case}',
      children: [
        {
          name: '{camelCase}.type.ts',
        },
      ],
    },
    {
      name: 'global',
      children: [
        {
          name: '{camelCase}.d.ts',
        },
      ],
    },
    {
      name: '{camelCase}.type.ts',
    },
  ],
}

const UTILS_FOLDER = {
  name: 'utils',
  children: [
    {
      name: '{kebab-case}',
      children: [
        {
          name: '{camelCase}.util.ts',
        },
        {
          name: '{camelCase}.util.spec.ts|{camelCase}.util.test.ts',
        },
      ],
    },
    {
      name: '{camelCase}.util.ts',
    },
  ],
}

const VIEWS_FOLDER = {
  name: 'views',
  children: [
    {
      name: '{PascalCase}View.vue',
    },
    {
      name: '{PascalCase}ViewDataProvider.vue',
    },
  ],
}

const DIALOGS_FOLDER = {
  name: 'dialogs',
  children: [
    {
      name: '{PascalCase}Dialog.vue',
    },
  ],
}

export const folderStructureConfig = createFolderStructure({
  rules: {
    components_folder: {
      name: '*',
      folderRecursionLimit: 3,
      children: [
        {
          ruleId: 'components_folder',
        },
        {
          name: '{PascalCase}.vue|{camelCase}.context.ts|{camelCase}.composable.ts|{camelCase}.type.ts|{camelCase}.props.ts',
        },
      ],
    },
    models_folder: {
      name: '*',
      folderRecursionLimit: 3,
      children: [
        {
          ruleId: 'models_folder',
        },
        {
          name: '{camelCase}.(model|builder|transformer|util|util.spec|util.test|enum).ts',
        },
      ],
    },
  },

  structure: [
    {
      name: '*',
    },
    {
      name: '*',
      children: [],
    },
    {
      name: 'src',
      children: [
        API_FOLDER,
        ASSETS_FOLDER,
        CLIENT_FOLDER,
        COMPONENT_VARIANTS_FOLDER,
        COMPONENTS_FOLDER,
        COMPOSABLES_FOLDER,
        CONFIGS_FOLDER,
        CONSTANTS_FOLDER,
        ICONS_FOLDER,
        LIBS_FOLDER,
        LOCALES_FOLDER,
        MIDDLEWARES_FOLDER,
        MOCKS_FOLDER,
        MODELS_FOLDER,
        PLUGINS_FOLDER,
        ROUTES_FOLDER,
        STORES_FOLDER,
        THEMES_FOLDER,
        TYPES_FOLDER,
        UTILS_FOLDER,
        DIALOGS_FOLDER,
        {
          name: 'modules',
          children: [
            {
              name: '{kebab-case}',
              children: [
                ROUTES_MODULE_FOLDER,
                COMPONENTS_FOLDER,
                COMPOSABLES_FOLDER,
                CONSTANTS_FOLDER,
                LOCALES_FOLDER,
                MOCKS_FOLDER,
                MODELS_FOLDER,
                STORES_FOLDER,
                TYPES_FOLDER,
                UTILS_FOLDER,
                VIEWS_FOLDER,
                DIALOGS_FOLDER,
                {
                  name: 'index.ts',
                },
                {
                  name: 'components.ts',
                },
                {
                  name: '*',
                  children: [],
                },
                {
                  name: 'features',
                  children: [
                    {
                      name: '{kebab-case}',
                      children: [
                        COMPONENTS_FOLDER,
                        COMPOSABLES_FOLDER,
                        CONSTANTS_FOLDER,
                        LOCALES_FOLDER,
                        MOCKS_FOLDER,
                        MODELS_FOLDER,
                        STORES_FOLDER,
                        TYPES_FOLDER,
                        UTILS_FOLDER,
                        VIEWS_FOLDER,
                        DIALOGS_FOLDER,
                        {
                          name: '*',
                          children: [],
                        },

                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: '*',
          children: [],
        },
        {
          name: 'main.ts',
        },
        {
          name: 'App.vue',
        },
        {
          name: 'AppProviders.vue',
        },
      ],
    },
  ],
})

export const projectStructureConfig: LintConfig = {
  name: 'project-structure',
  files: [
    '**',
  ],
  ignores: [
    'projectStructure.cache.json',
    '**/node_modules/**',
    '**/public/**',
    '**/*.{png,jpg,jpeg,gif,svg,js,webp,ico,mp4,webm,mp3,wav,flac,aac,woff2,woff,eot,ttf,html,css,scss}',
    '**/dist/**',
    '**/.husky/**',
    '**/.vscode/**',
    '**/coverage/**',
  ],
  languageOptions: {
    parser: projectStructureParser,
  } as any,
  plugins: {
    'project-structure': projectStructurePlugin,
  },
  rules: {
    // If you have many rules in a separate file.
    'project-structure/folder-structure': [
      'error',
      folderStructureConfig,
    ],
  },
  settings: {},
}
