import Layout from "@/layout";

export const imRouter = [

    {
        path: '/chat/:sendUserId(\\d+)/:receiveUserId(\\d+)',
        hidden: true,
        component: () => import('@/views/im/chat')
    },
]
