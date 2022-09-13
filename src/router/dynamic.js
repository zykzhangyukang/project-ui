const dynamicRouters = [
    {
        path: '/',
        name: 'Home',
        redirect: '/welcome',
        component: () => import('../layouts/home.vue'),
        children: [
            {
                path: '/welcome',
                key: 'welcome',
                component: () => import('../views/welcome'),
            },
            {
                path: '/auth/user-management',
                key: 'user-management',
                component: () => import('../views/auth/user-management/index'),
            },
            {
                path: '/auth/role-management',
                key: 'role-management',
                component: () => import('../views/auth/role-management/index'),
            }, {
                path: '/auth/res-management',
                key: 'res-management',
                component: () => import('../views/auth/res-management/index'),
            },
            {
                path: '/auth/func-management',
                key: 'func-management',
                component: () => import('../views/auth/func-management/index'),
            },
            {
                path: '*',
                component: () => import('../views/404')
            }
        ]
    },
]

export default dynamicRouters