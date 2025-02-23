import Layout from "@/layout";

export const stuRouter = [
    {
        path: '/stu/lesson/bindPoint',
        component: Layout,
        hidden: true,
        permissions: ['stu:lesson:edit'],
        children: [
            {
                path: ':id(\\d+)',
                component: () => import('@/views/stu/lesson/bindPoint'),
                name: 'bindPoint',
                meta: {title: '课程添加观察点', activeMenu: '/stu/lesson'}
            }
        ]
    },
    {
        path: '/stu/point/bindLesson',
        component: Layout,
        hidden: true,
        permissions: ['stu:inspectPoint:edit'],
        children: [
            {
                path: ':id(\\d+)',
                component: () => import('@/views/stu/inspectPoint/bindLesson'),
                name: 'bindLesson',
                meta: {title: '课程添加课程', activeMenu: '/stu/inspectPoint'}
            }
        ]
    },



    {
        path: '/stu/student/form',
        component: Layout,
        hidden: true,
        permissions: ['stu:induction:add'],
        children: [
            {
                path: 'add',
                component: () => import('@/views/stu/student/form'),
                name: 'student',
                meta: {title: '学生登记信息表', activeMenu: '/staff/induction'}
            },
            {
                path: ':formId(\\d+)',
                component: () => import('@/views/stu/student/form'),
                name: 'student',
                meta: {title: '学生登记信息表', activeMenu: '/staff/induction'}
            }
        ]
    },

    {
        path: '/stu/score/studentScore',
        component: Layout,
        hidden: true,
        permissions: ['stu:score:list'],
        children: [
            {
                path: ':lessonId(\\d+)',
                component: () => import('@/views/stu/score/studentScore'),
                name: 'studentScore',
                meta: {title: '学生成绩', activeMenu: '/stu/score'}
            }
        ]
    },

    {
        path: '/stu/calc/viewLessonPointTarget',
        component: Layout,
        hidden: true,
        permissions: ['stu:score:list'],
        children: [
            {
                path: ':lessonId(\\d+)',
                component: () => import('@/views/stu/calc/viewLessonPointTarget'),
                name: 'viewLessonPointTarget',
                meta: {title: '达成度计算', activeMenu: '/stu/calcLessonPointTarget'}
            }
        ]
    },
]
