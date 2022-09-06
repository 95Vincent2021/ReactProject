// src/routes/index.tsx
import React, { lazy, Suspense, FC } from "react";
import { useRoutes } from "react-router-dom";
import {
  HomeOutlined,
  ShopOutlined,
  DatabaseOutlined,
  UserOutlined,
  UnorderedListOutlined,
  TableOutlined,
} from "@ant-design/icons";
import type { XRoutes } from "./types";

import { Layout, EmptyLayout, CompLayout } from "../layouts";
import Loading from "@comps/Loading";
import Redirect from "@comps/Redirect";

const Login = lazy(() => import("@pages/login"));
const Dashboard = lazy(() => import("@pages/dashboard"));
const NotFound = lazy(() => import("@pages/404"));

// 引入路由组件
const HospitalSet = lazy(() => import("@pages/hospital/hospitalSet"));
const AddOrUpdateHospital = lazy(
  () => import("@pages/hospital/hospitalSet/components/AddOrUpdateHospital")
);
const HospitalList = lazy(() => import("@pages/hospital/hospitalList"));
const HospitalShow = lazy(
  () => import("@pages/hospital/hospitalList/components/HospitalShow")
);
const HospitalSchedule = lazy(
  () => import("@pages/hospital/hospitalList/components/HospitalSchedule")
);

const Dict = lazy(() => import("@pages/cmn/dict"));
const UserList = lazy(() => import("@pages/user/userList"));
const UserListShow = lazy(
  () => import("@pages/user/userList/components/UserListShow")
);
const AuthList = lazy(() => import("@pages/user/authList"));
const OrderList = lazy(() => import("@pages/order/orderList"));
const OrderListShow = lazy(
  () => import("@pages/order/orderList/components/OrderListShow")
);
const StatisticsOrder = lazy(() => import("@pages/statistics/order"));

const load = (Comp: FC) => {
  return (
    // 因为路由懒加载，组件需要一段网络请求时间才能加载并渲染
    // 在组件还未渲染时，fallback就生效，来渲染一个加载进度条效果
    // 当组件渲染完成时，fallback就失效了
    <Suspense fallback={<Loading />}>
      {/* 所有lazy的组件必须包裹Suspense组件，才能实现功能 */}
      <Comp />
    </Suspense>
  );
};

const routes: XRoutes = [
  {
    path: "/",
    element: <EmptyLayout />,
    children: [
      {
        path: "login",
        element: load(Login),
      },
    ],
  },
  {
    path: "/syt",
    element: <Layout />,
    children: [
      {
        path: "/syt/dashboard",
        meta: { icon: <HomeOutlined />, title: "首页" },
        element: load(Dashboard),
      },
      // 路由配置
      {
        // 路由访问路径
        path: "/syt/hospital",
        // 将来左侧菜单会根据meta内容生成
        meta: {
          // 菜单图标
          icon: <ShopOutlined />,
          // 菜单标题
          title: "医院管理",
        },
        // element代表要渲染的组件
        // 而父级菜单并不会加载真正的内容，所以渲染的其实就一个Outlet
        // Outlet组件就是渲染子路由组件：也就是医院设置、医院列表组件
        element: <CompLayout />,
        // 子路由配置
        children: [
          {
            path: "/syt/hospital/hospitalSet",
            meta: { title: "医院设置" },
            element: load(HospitalSet),
          },
          {
            path: "/syt/hospital/hospitalSet/add",
            meta: { title: "添加医院" },
            element: load(AddOrUpdateHospital),
            hidden: true,
          },
          {
            path: "/syt/hospital/hospitalSet/edit/:id",
            meta: { title: "修改医院" },
            element: load(AddOrUpdateHospital),
            hidden: true,
          },
          {
            path: "/syt/hospital/hospitalList",
            meta: { title: "医院列表" },
            element: load(HospitalList),
          },
          {
            path: "/syt/hospital/hospitalList/show/:id",
            meta: { title: "查看医院详情" },
            element: load(HospitalShow),
            hidden: true,
          },
          {
            path: "/syt/hospital/hospitalList/schedule/:id",
            meta: { title: "查看医院排班" },
            element: load(HospitalSchedule),
            hidden: true,
          },
        ],
      },
      {
        path: "/syt/cmn",
        meta: { icon: <DatabaseOutlined />, title: "数据管理" },
        element: <CompLayout />,
        children: [
          {
            path: "/syt/cmn/dict",
            element: load(Dict),
            meta: { title: "数据字典" },
          },
        ],
      },
      {
        path: "/syt/user",
        meta: { icon: <UserOutlined />, title: "会员管理" },
        element: <CompLayout />,
        children: [
          {
            path: "/syt/user/userInfo",
            element: load(UserList),
            meta: { title: "会员列表" },
          },
          {
            path: "/syt/user/userInfo/show/:id",
            element: load(UserListShow),
            meta: { title: "会员列表" },
            hidden: true,
          },
          {
            path: "/syt/user/userInfo/authList",
            element: load(AuthList),
            meta: { title: "认证审批列表" },
          },
        ],
      },
      {
        path: "/syt/order",
        meta: { icon: <UnorderedListOutlined />, title: "订单管理" },
        element: <CompLayout />,
        children: [
          {
            path: "/syt/order/orderInfo",
            meta: { title: "订单列表" },
            element: load(OrderList),
          },
          {
            path: "/syt/order/orderInfo/show/:id",
            element: load(OrderListShow),
            meta: { title: "订单列表" },
            hidden: true,
          },
        ],
      },
      {
        path: "/syt/statistics",
        meta: { icon: <TableOutlined />, title: "统计管理" },
        element: <CompLayout />,
        children: [
          {
            path: "/syt/statistics/order",
            meta: { title: "预约统计" },
            element: load(StatisticsOrder),
          },
        ],
      },
    ],
  },

  {
    path: "/404",
    element: load(NotFound),
  },
  {
    path: "*",
    element: <Redirect to="/404" />,
  },
];

// 渲染路由
// 注意：首字母必须大写
export const RenderRoutes = () => {
  // react-router-dom的新增语法。不用自己遍历了，它帮我们遍历生成
  return useRoutes(routes);
};

// 找到要渲染成左侧菜单的路由
export const findSideBarRoutes = () => {
  const currentIndex = routes.findIndex((route) => route.path === "/syt");
  return routes[currentIndex].children as XRoutes;
};

export default routes;
