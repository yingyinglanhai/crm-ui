import Layout from "@/layout";

export const crmRouter = [

    {
        path: '/crm/clue/clue/form',
        component: Layout,
        hidden: true,
        permissions: ['crm:crmCustomer:add'],
        children: [
            {
                path: 'add',
                component: () => import('@/views/crm/crmCustomer/form'),
                name: 'CustomerForm',
                meta: {title: '线索信息', activeMenu: '/crm/clue/clue'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/crm/crmCustomer/form'),
                name: 'CustomerForm',
                meta: {title: '线索信息', activeMenu: '/crm/clue/clue'}
            }
        ]
    },
    {
        path: '/crm/customer/crmCustomer/form',
        component: Layout,
        hidden: true,
        permissions: ['crm:crmCustomer:add'],
        children: [
            {
                path: 'add',
                component: () => import('@/views/crm/crmCustomer/form'),
                name: 'CustomerForm',
                meta: {title: '客户信息', activeMenu: '/crm/customer/crmCustomer'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/crm/crmCustomer/form'),
                name: 'CustomerForm',
                meta: {title: '客户信息', activeMenu: '/crm/customer/crmCustomer'}
            }
        ]
    },


]











































































