import type { RouteRecordRaw } from 'vue-router';

export const iamRoutes: RouteRecordRaw = {
  path: '/iam',
  component: () => import('./iam-page.vue'),
  meta: {
    permission: '/iam',
    key: 'iam',
    skipPermission: false,
  },
};
