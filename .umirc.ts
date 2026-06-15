import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    dark: true,
    import: false,
    style: 'less',
  },
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: 'data',
  },
  layout: {
    title: '综合管理后台',
  },
  mfsu: false,
  esbuildMinifyIIFE: true,
  proxy: {
    '/logout': {
      target: 'http://10.100.1.152:8002/',
      changeOrigin: true,
    },
    '/api': {
      target: 'http://10.100.1.152:8002/',
      changeOrigin: true,
    },
  },
  npmClient: 'yarn',
});
