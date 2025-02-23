import Layout from "@/layout";

export const erpRouter = [


    {
        path: '/material/source/form',
        component: Layout,
        hidden: true,
        permissions: ['material:source:add'],
        children: [
            {
                path: 'add',
                component: () => import('@/views/erp/material/source/form'),
                name: 'SourceForm',
                meta: {title: '物料构成信息表', activeMenu: '/material/material'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/erp/material/source/form'),
                name: 'SourceForm',
                meta: {title: '物料构成信息表', activeMenu: '/material/material'}
            }
        ]
    },

    {
        path: '/erp/buy/buyBill/form',
        component: Layout,
        hidden: true,
        permissions: ['depot:buyBill:add'],
        children: [
            {
                path: 'add',
                component: () => import('@/views/erp/depot/buyBill/form'),
                name: 'BuyBillForm',
                meta: {title: '采购订单信息表', activeMenu: '/depot/buy/buyBill'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/erp/depot/buyBill/form'),
                name: 'BuyBillForm',
                meta: {title: '采购订单信息表', activeMenu: '/depot/buy/buyBill'}
            }
        ]
    },
    {
        path: '/erp/buy/buyIn/form',
        component: Layout,
        hidden: true,
        permissions: ['depot:buyIn:add'],
        children: [
            {
                path: 'add',
                component: () => import('@/views/erp/depot/buyIn/form'),
                name: 'BuyInForm',
                meta: {title: '采购入库信息表', activeMenu: '/depot/buyIn'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/erp/depot/buyIn/form'),
                name: 'BuyInForm',
                meta: {title: '采购入库信息表', activeMenu: '/depot/buyIn'}
            }
        ]
    },
    {
        path: '/erp/buy/buyBack/form',
        component: Layout,
        hidden: true,
        permissions: ['depot:buyBack:add'],
        children: [
            {
                path: 'add',
                component: () => import('@/views/erp/depot/buyBack/form'),
                name: 'BuyBackForm',
                meta: {title: '采购退货信息表', activeMenu: '/depot/buyBack'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/erp/depot/buyBack/form'),
                name: 'BuyBackForm',
                meta: {title: '采购退货信息表', activeMenu: '/depot/buyBack'}
            }
        ]
    },
    {
        path: '/ct/agreement/agreementTask',
        component: Layout,
        hidden: true,
        permissions: ['oa:myTask:list'],
        children: [
            {
                path: ':formId',
                component: () => import('@/views/erp/ct/agreement/agreementTask'),
                name: 'AgreementTask',
                meta: {title: '补充协议', activeMenu: '/oa/myTask'}
            }
        ]
    }
]
