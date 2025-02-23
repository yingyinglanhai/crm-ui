import Layout from "@/layout";

export const wmsRouter = [

    {
        path: '/wms/storeBill/inStoreBill',
        component: Layout,
        hidden: true,
        permissions: ['wms:storeBill:edit'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/wms/storeBill/storeIn'),
                name: 'InStoreBill',
                meta: {title: '入库单', activeMenu: '/wms/storeBill/in'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/wms/storeBill/storeIn'),
                name: 'InStoreBill',
                meta: {title: '入库单', activeMenu: '/wms/storeBill/in'}
            }
        ]
    },

    {
        path: '/wms/storeBill/outStoreBill',
        component: Layout,
        hidden: true,
        permissions: ['wms:storeBill:edit'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/wms/storeBill/storeOut'),
                name: 'OutStoreBill',
                meta: {title: '出库单', activeMenu: '/wms/storeBill/out'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/wms/storeBill/storeOut'),
                name: 'OutStoreBill',
                meta: {title: '出库单', activeMenu: '/wms/storeBill/out'}
            }
        ]
    },

    {
        path: '/wms/storeBill/allotStoreBill',
        component: Layout,
        hidden: true,
        permissions: ['wms:storeBill:edit'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/wms/storeBill/storeAllot'),
                name: 'AllotStoreBill',
                meta: {title: '调拨单', activeMenu: '/wms/storeBill/allot'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/wms/storeBill/storeAllot'),
                name: 'AllotStoreBill',
                meta: {title: '调拨单', activeMenu: '/wms/storeBill/allot'}
            }
        ]
    },

    {
        path: '/wms/check/stockCheck/check',
        component: Layout,
        permissions: ['wms:storeBill:edit'],
        children: [
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/wms/stockCheck/check'),
                name: 'StockCheckData',
                meta: {title: '盘点单', activeMenu: '/wms/check/stockCheck'}
            }
        ]

    },

]
