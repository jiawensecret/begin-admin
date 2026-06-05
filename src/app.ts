// 运行时配置
import services from '@/services/global';
import {
  clearToken,
  getToken,
  getUserIdFromToken,
  isTokenExpired,
} from '@/utils/auth';
import { RunTimeLayoutConfig } from '@@/plugin-layout/types';
import { theme } from 'antd';
import { history, RequestConfig, RuntimeAntdConfig } from 'umi';

export const antd: RuntimeAntdConfig = (memo) => {
  memo.theme ||= {};
  memo.theme.algorithm = theme.darkAlgorithm;
  return memo;
};

export const request: RequestConfig = {
  timeout: 5000,
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [
    [
      (url, options) => {
        const token = getToken();
        const userId = getUserIdFromToken();
        options.headers = {
          ...(options.headers || {}),
          ...(token ? { 'x-token': token } : {}),
          ...(userId ? { 'user-id': String(userId) } : {}),
        };
        return { url, options };
      },
      (error: any) => {
        return Promise.reject(error);
      },
    ],
  ],
  responseInterceptors: [
    [
      (response) => {
        return response;
      },
      (error: any) => {
        const { status } = error.response || {};
        if (status === 403) {
          clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    ],
  ],
};
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<Common.Me> {
  if (window.location.pathname === '/login') return {};
  if (!getToken() || isTokenExpired()) {
    clearToken();
    history.replace('/login');
    return {};
  }

  const res = await services.GlobalController.getCurrentUser();

  if (!res.data) return {}; // 运行时配置

  if (res.data.permissions) {
    let k: any[] = [];
    res.data.permissions.forEach((v) => {
      k.push(v.code);
    });
    res.data.permission = k;
  }
  return res.data;
}

const filterRemovedMenus = (menus: Common.Menu[] = []): Common.Menu[] => {
  return menus
    .filter((menu) => {
      const text = `${menu.name || ''} ${menu.path || ''} ${
        menu.component || ''
      }`;
      return !/world-cup|WorldCup|世界杯/i.test(text);
    })
    .map((menu) => ({
      ...menu,
      routes: filterRemovedMenus(menu.routes),
    }));
};

export const layout: RunTimeLayoutConfig = () => {
  return {
    onPageChange: () => {
      const { pathname } = window.location;
      if (pathname !== '/login' && (!getToken() || isTokenExpired())) {
        clearToken();
        history.replace('/login');
      }
    },
    menu: {
      request: async () => {
        const menuData = await services.GlobalController.getMenus();
        return filterRemovedMenus(menuData.data);
      },
    },
  };
};

// export const layout = () => {
//   return {
//     menu: {
//       locale: false,
//     },
//     menuDataRender: () => {
//       return [
//         {
//           name: '首页',
//           path: '/home',
//           component: './Home',
//         },
//         {
//           name: '权限演示',
//           path: '/access',
//           component: './Access',
//         },
//         {
//           name: '通用管理',
//           path: '/test',
//           component: '',
//           routes : [
//             {
//               name: ' CRUD 示例',
//               path: '/table',
//               component: './Table',
//             }
//           ]
//         },
//         {
//           name: '通用管理',
//           path: '/test',
//           component: '',
//           routes : [
//             {
//               name: ' CRUD 示例',
//               path: '/table',
//               component: './Table',
//             }
//           ]
//         },
//       ];
//     }
//   };
// };
