import Layout from "@/layout";

export const assetRouter = [

    {
        path: '/asset/buyorder/buyorderBill/form',
        component: Layout,
        hidden: true,
        permissions: ['asset:buyorderBill:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/asset/buyorderBill/form'),
                name: 'BuyorderBillForm',
                meta: {title: '采购订单', activeMenu: '/asset/buyorder/buyorderBill'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/asset/buyorderBill/form'),
                name: 'BuyorderBillForm',
                meta: {title: '采购订单', activeMenu: '/asset/buyorder/buyorderBill'}
            }
        ]
    },

    {
        path: '/asset/buyorder/sellorderBill/form',
        component: Layout,
        hidden: true,
        permissions: ['asset:buyorderBill:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/asset/buyorderBill/form'),
                name: 'BuyorderBillForm',
                meta: {title: '销售订单', activeMenu: '/asset/buyorder/sellorderBill'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/asset/buyorderBill/form'),
                name: 'BuyorderBillForm',
                meta: {title: '销售订单', activeMenu: '/asset/buyorder/sellorderBill'}
            }
        ]
    },



    {
        path: '/asset/enquiry/sell/form',
        component: Layout,
        hidden: true,
        permissions: ['asset:enquiry:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/asset/enquiry/form'),
                name: 'EnquiryForm',
                meta: {title: '销售询价', activeMenu: '/asset/enquiry/sell'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/asset/enquiry/form'),
                name: 'EnquiryForm',
                meta: {title: '销售询价', activeMenu: '/asset/enquiry/sell'}
            }
        ]
    },


    {
        path: '/asset/enquiry/buy/form',
        component: Layout,
        hidden: true,
        permissions: ['asset:enquiry:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/asset/enquiry/form'),
                name: 'EnquiryForm',
                meta: {title: '采购询价', activeMenu: '/asset/enquiry/buy'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/asset/enquiry/form'),
                name: 'EnquiryForm',
                meta: {title: '采购询价', activeMenu: '/asset/enquiry/buy'}
            }
        ]
    },
]
