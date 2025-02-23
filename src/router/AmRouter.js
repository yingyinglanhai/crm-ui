import Layout from "@/layout";

export const amRouter = [

    {
        path: '/am/amArchive/form',
        component: Layout,
        hidden: true,
        permissions: ['am:amArchive:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/am/amArchive/form'),
                name: 'ArchiveForm',
                meta: {title: '档案信息', activeMenu: '/am/amArchive'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/am/amArchive/form'),
                name: 'ArchiveForm',
                meta: {title: '档案信息', activeMenu: '/am/amArchive'}
            }
        ]
    },

    {
        path: '/am/amBorrow/form',
        component: Layout,
        hidden: true,
        permissions: ['am:amBorrow:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/am/amBorrow/form'),
                name: 'ArchiveForm',
                meta: {title: '档案借阅', activeMenu: '/am/amBorrow'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/am/amBorrow/form'),
                name: 'ArchiveForm',
                meta: {title: '档案借阅', activeMenu: '/am/amBorrow'}
            }
        ]
    },


    {
        path: '/am/auth/authRole/allotFolder',
        component: Layout,
        hidden: true,
        permissions: ['am:authRole:add'],
        children: [
            {
                path: ':id(\\d+)',
                component: () => import('@/views/am/amAuth/allotFolder'),
                name: 'AllotFolder',
                meta: {title: '授权文件夹', activeMenu: '/am/auth/authRole'}
            }
        ]
    },
    {
        path: '/am/auth/authUser/allotFolder',
        component: Layout,
        hidden: true,
        permissions: ['am:authRole:add'],
        children: [
            {
                path: ':id(\\d+)',
                component: () => import('@/views/am/amAuth/allotFolder'),
                name: 'AllotFolder',
                meta: {title: '授权文件夹', activeMenu: '/am/auth/authUser'}
            }
        ]
    },
]
