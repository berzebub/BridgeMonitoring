
const routes = [
  {
    path: "",
    component: () => import("pages/splashScreen.vue"),
    name : "splashScreen"
  },
  {
    path: "/addData",
    component: () => import("pages/addData.vue"),
    name : "addData"
  },
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/project', component: () => import('pages/project.vue'),
        name : "project"
      },
      {
        path: '/monitor', component: () => import('pages/monitor.vue'),
        name : "monitor"
      },
      {
        path: '/settings', component: () => import('pages/settings.vue'),
        name : "settings"
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
