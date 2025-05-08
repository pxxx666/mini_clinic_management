import access from '@/access';

/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },

  {
    path: '/landing',
    name: 'landing',
    layout: false,
    component: './Landing',
  },

  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/doctor/workplace',
    name: '工作台',
    icon: 'FormOutlined',
    component: './Workplace',
    access: 'canDoctor',
  },
  {
    path: '/doctor/enter',
    name: '个人信息',
    icon: 'UserOutlined',
    component: './Doctor/Enter',
    access: 'canDoctor',
  },
  {
    path: '/rating',
    name: '我的评价',
    icon: 'star',
    component: './Rating',
    access: 'canDoctor',
  },
  {
    path: '/user/management',
    name: '用户管理',
    icon: 'team',
    access: 'canAdmin',
    component: './User/Management',
  },
  {
    path: '/health-tools',
    name: '健康管理工具',
    icon: 'tool',
    component: './HealthTools',
  },

  {
    path: '/records',
    name: '健康记录',
    icon: 'ReconciliationOutlined',
    component: './Record',
    access: 'canPatient',
  },
  {
    path: '/book',
    name: '预约',
    icon: 'PlusCircleOutlined',
    component: './Book',
  },
  {
    path: '/book/create/:doctorId',
    name: '创建预约',
    component: './Book/Create',
    hideInMenu: true,
  },
  {
    path: '/aiDoctor',
    name: 'aiDoctor',
    icon: 'aliwangwang',
    component: './AiDoctor',
  },
  {
    path: '/department',
    name: '科室管理',
    icon: 'ApartmentOutlined',
    component: './DepartmentManagement',
  },

  {
    path: '/doctor/manage',
    name: '医生信息管理',
    icon: 'UserOutlined',
    access: 'canAdmin',
    component: './Doctor/Manage',
  },
  {
    path: '/drug',
    name: '药物管理',
    icon: 'MedicineBoxOutlined',
    access: 'canAdmin',
    component: './DrugManagement',
  },
  {
    path: '/',
    redirect: '/landing',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
