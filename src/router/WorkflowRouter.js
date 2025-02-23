import Layout from "@/layout";

export const workflowRouter = [
    {
        path: '/oa/model/modelDesigner',
        component: Layout,
        hidden: true,
        permissions: ['oa:model:modelDesigner'],
        children: [
            {
                path: ':modelId',
                component: () => import('@/views/workflow/model/modelDesigner'),
                name: 'ModelDesigner',
                meta: {title: '流程图设计器', activeMenu: '/oa/model'}
            }
        ]
    },


]
