import Layout from "@/layout";

export const hrmRouter = [
    {
        path: '/hrm/staff/induction/form',
        component: Layout,
        hidden: true,
        permissions: ['staff:induction:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/hrm/staff/induction/form'),
                name: 'StaffInductionForm',
                meta: {title: '员工入职登记信息表', activeMenu: '/hrm/staff/induction'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/hrm/staff/induction/form'),
                name: 'StaffInductionForm',
                meta: {title: '员工入职登记信息表', activeMenu: '/hrm/staff/induction'}
            }
        ]
    },
    {
        path: '/hrm/staff/book/form',
        component: Layout,
        hidden: true,
        permissions: ['staff:induction:edit'],
        children: [
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/hrm/staff/book/form'),
                name: 'StaffBookForm',
                meta: {title: '员工档案信息', activeMenu: '/hrm/staffView/book'}
            }
        ]
    },
    {
        path: '/hrm/staff/toformal/form',
        component: Layout,
        hidden: true,
        permissions: ['staff:toformal:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/hrm/staff/toformal/form'),
                name: 'StaffToformalForm',
                meta: {title: '员工转正申请表', activeMenu: '/hrm/staff/toformal'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/hrm/staff/toformal/form'),
                name: 'toformalForm',
                meta: {title: '员工转正申请表', activeMenu: '/hrm/staff/toformal'}
            }
        ]
    },
    {
        path: '/hrm/staff/quit/form',
        component: Layout,
        hidden: true,
        permissions: ['staff:quit:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/hrm/staff/quit/form'),
                name: 'StaffQuitForm',
                meta: {title: '员工离职申请表', activeMenu: '/hrm/staff/quit'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/hrm/staff/quit/form'),
                name: 'StaffQuitForm',
                meta: {title: '员工离职申请表', activeMenu: '/hrm/staff/quit'}
            }
        ]
    },


    //招聘需求
    {
        path: '/hrm/recruit/recruitDemand/form',
        component: Layout,
        hidden: true,
        permissions: ['hrm:recruitDemand:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/hrm/recruitDemand/form'),
                name: 'RecruitDemandForm',
                meta: {title: '招聘需求', activeMenu: '/hrm/recruit/recruitDemand'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/hrm/recruitDemand/form'),
                name: 'RecruitDemandForm',
                meta: {title: '招聘需求', activeMenu: '/hrm/recruit/recruitDemand'}
            }
        ]
    },

    //招聘计划
    {
        path: '/hrm/recruit/recruitPlan/form',
        component: Layout,
        hidden: true,
        permissions: ['hrm:recruitPlan:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/hrm/recruitPlan/form'),
                name: 'RecruitPlanForm',
                meta: {title: '招聘计划', activeMenu: '/hrm/recruit/recruitPlan'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/hrm/recruitPlan/form'),
                name: 'RecruitPlanForm',
                meta: {title: '招聘计划', activeMenu: '/hrm/recruit/recruitPlan'}
            }
        ]
    },



    //岗位调整申请
    {
        path: '/hrm/postChange/form',
        component: Layout,
        hidden: true,
        permissions: ['hrm:postChange:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/hrm/postChange/form'),
                name: 'RecruitPlanForm',
                meta: {title: '岗位调整申请', activeMenu: '/hrm/changePost/postChange'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/hrm/postChange/form'),
                name: 'RecruitPlanForm',
                meta: {title: '岗位调整申请', activeMenu: '/hrm/changePost/postChange'}
            }
        ]
    },



    //奖惩申请
    {
        path: '/hrm/rewardPunish/form',
        component: Layout,
        hidden: true,
        permissions: ['hrm:rewardPunish:add'],
        children: [
            {
                path: 'add/:billType',
                component: () => import('@/views/hrm/rewardPunish/form'),
                name: 'RewardPunishForm',
                meta: {title: '奖励惩罚申请', activeMenu: '/hrm/rewardPunish/rewardPunish'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/hrm/rewardPunish/form'),
                name: 'RewardPunishForm',
                meta: {title: '奖励惩罚申请', activeMenu: '/hrm/rewardPunish/rewardPunish'}
            }
        ]
    },


    //工资项配置--初始化
    {
        path: '/hrm/config/salaryItemCfg',
        component: Layout,
        permissions: ['hrm:salaryItemConfig:add'],
        hidden: true,
        children: [
            {
                path: 'init',
                component: () => import('@/views/hrm/salaryItemConfig/init'),
                name: 'SalaryItemConfigInit',
                meta: {title: '工资项配置', activeMenu: '/hrm/config/salaryItemConfig'}
            }
        ]
    },


    //社保明细
    {
        path: '/hrm/socialInsncMng/insncData',
        component: Layout,
        permissions: ['hrm:salaryItemConfig:add'],
        hidden: true,
        children: [
            {
                path: 'detail/:year/:month',
                component: () => import('@/views/hrm/socialInsncData/detail'),
                name: 'SocialInsncDataDetail',
                meta: {title: '社保缴纳明细', activeMenu: '/hrm/socialInsncMng/socialInsncData'}
            }
        ]
    },
]
