// vite.config.mjs
import Components from "file:///var/www/projects/edutiek1/long-essay-assessment-writer/node_modules/unplugin-vue-components/dist/vite.js";
import vue from "file:///var/www/projects/edutiek1/long-essay-assessment-writer/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Vuetify, { transformAssetUrls } from "file:///var/www/projects/edutiek1/long-essay-assessment-writer/node_modules/vite-plugin-vuetify/dist/index.mjs";
import ViteFonts from "file:///var/www/projects/edutiek1/long-essay-assessment-writer/node_modules/unplugin-fonts/dist/vite.mjs";
import { defineConfig } from "file:///var/www/projects/edutiek1/long-essay-assessment-writer/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///var/www/projects/edutiek1/long-essay-assessment-writer/vite.config.mjs";
var vite_config_default = defineConfig({
  // edu: use a relative path
  // https://vitejs.dev/guide/build.html#public-base-path
  base: "./",
  // edu.
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify(),
    Components(),
    ViteFonts({
      google: {
        families: [{
          name: "Roboto",
          styles: "wght@100;300;400;500;700;900"
        }]
      }
    })
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    },
    extensions: [
      ".js",
      ".json",
      ".jsx",
      ".mjs",
      ".ts",
      ".tsx",
      ".vue"
    ]
  },
  server: {
    port: 3e3,
    // edu: needed for hot reload
    strictPort: true,
    hmr: {
      clientPort: 3e3
    }
    // edu.
  }
  // edu: needed for tinymce
  // https://stackoverflow.com/questions/73125972/the-requested-module-node-modules-vite-deps-vue-js-does-not-provide-an-expor
  // build: {
  //   /** If you set esmExternals to true, this plugins assumes that
  //    all external dependencies are ES modules */
  //   commonjsOptions: {
  //     esmExternals: true
  //   },
  // }
  // edu.
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3Zhci93d3cvcHJvamVjdHMvZWR1dGllazEvbG9uZy1lc3NheS1hc3Nlc3NtZW50LXdyaXRlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3Zhci93d3cvcHJvamVjdHMvZWR1dGllazEvbG9uZy1lc3NheS1hc3Nlc3NtZW50LXdyaXRlci92aXRlLmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3Zhci93d3cvcHJvamVjdHMvZWR1dGllazEvbG9uZy1lc3NheS1hc3Nlc3NtZW50LXdyaXRlci92aXRlLmNvbmZpZy5tanNcIjsvLyBQbHVnaW5zXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgVnVldGlmeSwgeyB0cmFuc2Zvcm1Bc3NldFVybHMgfSBmcm9tICd2aXRlLXBsdWdpbi12dWV0aWZ5J1xuaW1wb3J0IFZpdGVGb250cyBmcm9tICd1bnBsdWdpbi1mb250cy92aXRlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIC8vIGVkdTogdXNlIGEgcmVsYXRpdmUgcGF0aFxuICAvLyBodHRwczovL3ZpdGVqcy5kZXYvZ3VpZGUvYnVpbGQuaHRtbCNwdWJsaWMtYmFzZS1wYXRoXG4gIGJhc2U6ICcuLycsXG4gIC8vIGVkdS5cbiAgcGx1Z2luczogW1xuICAgIHZ1ZSh7XG4gICAgICB0ZW1wbGF0ZTogeyB0cmFuc2Zvcm1Bc3NldFVybHMgfVxuICAgIH0pLFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS1sb2FkZXIvdHJlZS9tYXN0ZXIvcGFja2FnZXMvdml0ZS1wbHVnaW4jcmVhZG1lXG4gICAgVnVldGlmeSgpLFxuICAgIENvbXBvbmVudHMoKSxcbiAgICBWaXRlRm9udHMoe1xuICAgICAgZ29vZ2xlOiB7XG4gICAgICAgIGZhbWlsaWVzOiBbe1xuICAgICAgICAgIG5hbWU6ICdSb2JvdG8nLFxuICAgICAgICAgIHN0eWxlczogJ3dnaHRAMTAwOzMwMDs0MDA7NTAwOzcwMDs5MDAnLFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIGRlZmluZTogeyAncHJvY2Vzcy5lbnYnOiB7fSB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfSxcbiAgICBleHRlbnNpb25zOiBbXG4gICAgICAnLmpzJyxcbiAgICAgICcuanNvbicsXG4gICAgICAnLmpzeCcsXG4gICAgICAnLm1qcycsXG4gICAgICAnLnRzJyxcbiAgICAgICcudHN4JyxcbiAgICAgICcudnVlJyxcbiAgICBdLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIC8vIGVkdTogbmVlZGVkIGZvciBob3QgcmVsb2FkXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBobXI6IHtcbiAgICAgIGNsaWVudFBvcnQ6IDMwMDBcbiAgICB9XG4gICAgLy8gZWR1LlxuICB9LFxuICAvLyBlZHU6IG5lZWRlZCBmb3IgdGlueW1jZVxuICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MzEyNTk3Mi90aGUtcmVxdWVzdGVkLW1vZHVsZS1ub2RlLW1vZHVsZXMtdml0ZS1kZXBzLXZ1ZS1qcy1kb2VzLW5vdC1wcm92aWRlLWFuLWV4cG9yXG4gIC8vIGJ1aWxkOiB7XG4gIC8vICAgLyoqIElmIHlvdSBzZXQgZXNtRXh0ZXJuYWxzIHRvIHRydWUsIHRoaXMgcGx1Z2lucyBhc3N1bWVzIHRoYXRcbiAgLy8gICAgYWxsIGV4dGVybmFsIGRlcGVuZGVuY2llcyBhcmUgRVMgbW9kdWxlcyAqL1xuICAvLyAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAvLyAgICAgZXNtRXh0ZXJuYWxzOiB0cnVlXG4gIC8vICAgfSxcbiAgLy8gfVxuICAvLyBlZHUuXG5cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sV0FBVywwQkFBMEI7QUFDNUMsT0FBTyxlQUFlO0FBR3RCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsZUFBZSxXQUFXO0FBUm9MLElBQU0sMkNBQTJDO0FBV3hRLElBQU8sc0JBQVEsYUFBYTtBQUFBO0FBQUE7QUFBQSxFQUcxQixNQUFNO0FBQUE7QUFBQSxFQUVOLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFVBQVUsRUFBRSxtQkFBbUI7QUFBQSxJQUNqQyxDQUFDO0FBQUE7QUFBQSxJQUVELFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxNQUNSLFFBQVE7QUFBQSxRQUNOLFVBQVUsQ0FBQztBQUFBLFVBQ1QsTUFBTTtBQUFBLFVBQ04sUUFBUTtBQUFBLFFBQ1YsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRLEVBQUUsZUFBZSxDQUFDLEVBQUU7QUFBQSxFQUM1QixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsSUFDQSxZQUFZO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUVOLFlBQVk7QUFBQSxJQUNaLEtBQUs7QUFBQSxNQUNILFlBQVk7QUFBQSxJQUNkO0FBQUE7QUFBQSxFQUVGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFZRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
