import { Component } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'MainLayout',
      component: (): Promise<Component> =>
        import('@org/layout-main').then((m) => m.MainLayout),
      children: [
        {
          path: '/',
          name: 'HomePage',
          component: (): Promise<Component> =>
            import('@org/home-page').then((m) => m.HomePage),
        },
      ],
    },
    {
      path: '/admin',
      name: 'AdminLayout',
      component: (): Promise<Component> =>
        import('@org/layout-admin').then((m) => m.AdminLayout),
    },
    {
      path: '/auth',
      name: 'AuthLayout',
      component: (): Promise<Component> =>
        import('@org/layout-auth').then((m) => m.AuthLayout),
    },
  ],
});

export default router;
