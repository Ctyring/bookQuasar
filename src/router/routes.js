
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/register', component: () => import('pages/register.vue') },
      { path: '/login', component: () => import('pages/login.vue') },
      { path: '/message', component: () => import('pages/message.vue') },
      {
        path: 'person',
        component: () =>
          import ('pages/person.vue')
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
