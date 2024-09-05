import { defineConfig } from 'vite';
import path from 'path';
import packageJson from './package.json';

import VueDevTools from 'vite-plugin-vue-devtools'
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import { del } from '@kineticcafe/rollup-plugin-delete';
import { viteStaticCopy } from 'vite-plugin-static-copy'

import { DominionContentGenerate, HandleLocaleGenerateAndMerge } from './plugins/vite-dominion-content';

// On-demand components auto importing for Vue.
//import UnPluginVueComponents from 'unplugin-vue-components/vite'; 

const devServerPort = 5173

export default defineConfig( ({ mode}) => {
//console.log(process.argv)
  if (mode === "production" || mode === "development") {
   // mergeJSONLanguageFiles();
    DominionContentGenerate('docs');
    let ArgGenLocale = "Merge"
    if (process.argv.slice(3)[0] == "Gen") {
      ArgGenLocale = "Gen&Merge"
    }
    HandleLocaleGenerateAndMerge(ArgGenLocale, 'docs')
  }

  return {
    appType: 'spa',
    publicDir: 'false',
    /*
    Do not use publicDir feature to avoid duplcation of all image and pdf files.
    */
    define: {
      'Pkgejson_Version': JSON.stringify(packageJson.version),
      'Pkgejson_Name': JSON.stringify(packageJson.name),
      'Pkgejson_URL': JSON.stringify(packageJson.repository.url),
      'Pkgejson_Date': JSON.stringify(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'numeric' }))
    },
    plugins: [
      vue(),
      // mode === "development" && VueDevTools(),
      vueI18n({
        include: path.resolve(__dirname, './docs/locales/*.json'),
        compositionOnly: true, 
        fullInstall: true,
        allowDynamic: true,
        runtimeOnly: false
      }),
      del({
        targets: ['docs/*',
          '!docs/rules',
          '!docs/rules.fr',
          '!docs/rules.de',
          '!docs/img',
          '!docs/favicon.ico',
          '!docs/dominion-content.js',
          '!docs/locales',
          '!docs/locales/??.json',
          '!docs/CNAME',
          '!docs/ads.txt'],
        verbose: false
      }), 
      viteStaticCopy({
        targets: [ { src: 'styles/normalize-v8.css', dest: 'assets/' },
                  { src: 'styles/tailwind-ui.min.css', dest: 'assets/' }
        ]
      }),
    ],
    optimizeDeps: {
      include: ['vue', 'vue-i18n']
    },
    resolve: {
      //extensions: ['.ts', '.vue'],
      alias: {
        // Alias pour les modules non-Esbuild compatibles avec Vite
        //'@': fileURLToPath(new URL('./src', import.meta.url)),
        //'vue-i18n': 'vue-i18n/dqist/vue-i18n.esm-bundler.js',
        //'vue': 'vue/dist/vue.esm-bundler.js', 
      },
    },
    build: {
      minify: false,
      outDir: 'docs',
      // to avoid having an empty docs directory 
      emptyOutDir: false,
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]'
        }
      },
    },
    server: {
      open: '/',
      proxy: {
        '^/$': {
          target: 'http://localhost:' + devServerPort,
          rewrite: (path) => '/index.html',
        },
        '/dominion-content.js': {
          target: 'http://localhost:' + devServerPort,
          rewrite: (path) => path.replace(/^\/dominion-content.js/, '/docs/dominion-content.js'),
        },
        '/normalize': {
          target: 'http://localhost:' + devServerPort,
          rewrite: (path) => path.replace(/^\/normalize/, '/docs/normalize'),
        },
        '/favicon.ico': {
          target: 'http://localhost:' + devServerPort,
          rewrite: (path) => path.replace(/^\/favicon.ico/, '/docs/favicon.ico'),
        },
        '/img': {
          target: 'http://localhost:' + devServerPort,
          rewrite: (path) => path.replace(/^\/img/, '/docs/img'),
        },
        '/rules': {
          target: 'http://localhost:' + devServerPort,
          rewrite: (path) => path.replace(/^\/rules/, '/docs/rules'),
        },
        '/locales': {
          target: 'http://localhost:' + devServerPort,
          rewrite: (path) => path.replace(/^\/locales/, '/docs/locales'),
        },
        '/?': {
          target: 'http://localhost:' + devServerPort,
          // rewrite: (path) => path.replace(/^\/?/, '/docs/index.html?'),
          rewrite: (path) => path.replace(/^\/?/, '/index.html?'),
        }
      },
    },
    preview: {
     proxy:{}
    }
  }
});

