import { useAuthStore } from '@org/api-client';
import { Roles } from '@org/enums';
import { Component } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'MainLayout',
      component: (): Promise<Component> => import('@org/main-layout').then((m) => m.MainLayout),
      children: [
        {
          path: '',
          name: 'MainHomePage',
          component: (): Promise<Component> => import('@org/main-home-page').then((m) => m.MainHomePage),
          meta: {
            title: 'Home',
          },
        },
      ],
    },
    {
      path: '/admin',
      name: 'AdminLayout',
      component: (): Promise<Component> => import('@org/admin-layout').then((m) => m.AdminLayout),
      children: [
        {
          path: '',
          name: 'AdminMainPage',
          component: (): Promise<Component> => import('@org/admin-home-page').then((m) => m.AdminHomePage),
          meta: {
            title: 'Admin Home',
            requiredAuth: true,
            requiredRoles: [Roles.ADMIN, Roles.MODERATOR],
          },
        },
      ],
    },
    {
      path: '/auth',
      name: 'AuthLayout',
      component: (): Promise<Component> => import('@org/auth-layout').then((m) => m.AuthLayout),
      children: [
        {
          path: 'login',
          name: 'AuthLoginPage',
          component: (): Promise<Component> => import('@org/auth-login-page').then((m) => m.AuthLoginPage),
          meta: {
            title: 'Login',
            guestOnly: true,
          },
        },
        {
          path: 'register',
          name: 'AuthRegisterPage',
          component: (): Promise<Component> => import('@org/auth-register-page').then((m) => m.AuthRegisterPage),
          meta: {
            title: 'Register',
            guestOnly: true,
          },
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (!auth.initialized) {
    await auth.init();
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return next('/');
  }

  if (to.meta.requiredAuth && !auth.isAuthenticated) {
    if (!auth.me) {
      return next('/auth/login');
    }
  }

  const requiredRoles = to.meta.requiredRoles as Roles[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = auth.me?.user.role;

    if (userRole === undefined || !requiredRoles.includes(userRole)) {
      return next('/');
    }
  }

  next();
});

router.afterEach((to) => {
  document.title = to.meta.title ? `TAVERN - ${to.meta.title}` : 'TAVERN';
  window.scrollTo(0, 0);
});

export default router;
