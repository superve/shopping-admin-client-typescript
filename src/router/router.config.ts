import { RouteRecordRaw } from "vue-router"
import BasicLayout from "../layouts/BasicLayout.vue";
import MainLayout from "../layouts/MainLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

/**
 * 路由需经过权限策略过滤，通过路由守卫过滤
 */

// 菜单和路由耦合的配置
export const menusRoutes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "index",
        component: BasicLayout,
        redirect: "/dashboard",
        meta: {
            title: "",
            keepAlive: true,
            policies: ["AUTHOR"]
        },
        children: [
            {
                path: "/dashboard",
                name: "dasgborad",
                component: () => import("../views/dashboard/Index.vue"),
                meta: {
                    label: "首页"
                }
            },
            {
                path: "/user",
                redirect: "/user/center",
                component: MainLayout,
                meta: {
                    label: "用户管理"
                },
                children: [
                    {
                        path: 'center',
                        component: () => import("../views/user/Center.vue"),
                        meta: {
                            label: "用户列表"
                        }
                    }

                ]
            },
            {
                path: "/goods",
                redirect: "/goods/center",
                component: MainLayout,
                meta: {
                    label: "商品管理",
                    policies: ["AUTHOR", "CHARGE"]
                },
                children: [
                    {
                        path: "center",
                        component: () => import("../views/goods/Center.vue"),
                        meta: {
                            label: "商品列表"
                        }
                    },
                    {
                        path: "create",
                        component: () => import("../views/goods/Create.vue"),
                        meta: {
                            label: "新增商品"
                        }
                    },
                    {
                        path: "update/:id",
                        component: () => import("../views/goods/Update.vue"),
                        meta: {
                            label: "编辑商品",
                            hiddenMenu: true
                        }
                    }
                ]
            },
            {
                path: "/category",
                redirect: "/category/center",
                component: MainLayout,
                meta: {
                    label: "栏目管理",
                    policies: ["AUTHOR", "CHARGE"]
                },
                children: [
                    {
                        path: "center",
                        component: () => import("../views/category/Center.vue"),
                        meta: {
                            label: "栏目列表"
                        }
                    }
                ]
            },
            {
                path: "/order",
                redirect: "/order/center",
                component: MainLayout,
                meta: {
                    label: "订单管理",
                    policies: ["AUTHOR", "CHARGE"]
                },
                children: [
                    {
                        path: "center",
                        component: () => import("../views/order/Center.vue"),
                        meta: {
                            label: "订单列表"
                        }
                    },
                    {
                        path: "update/:id",
                        component: () => import("../views/order/Update.vue"),
                        meta: {
                            label: "编辑列表",
                            hiddenMenu: true
                        }
                    },
                ]
            },
            {
                path: "/admin-user",
                redirect: "/admin-user/center",
                component: MainLayout,
                meta: {
                    label: "管理员",
                    policies: ["ADMIN"]
                },
                children: [
                    {
                        path: "center",
                        component: () => import("../views/adminUser/Center.vue"),
                        meta: {
                            label: "管理员列表"
                        }
                    },
                    {
                        path: "create",
                        component: () => import("../views/adminUser/Create.vue"),
                        meta: {
                            label: "新增管理员"
                        }
                    },
                    {
                        path: "update/:id",
                        component: () => import("../views/adminUser/Update.vue"),
                        meta: {
                            label: "编辑管理员",
                            hiddenMenu: true
                        }
                    }
                ]
            },
        ]
    }
]

// 普通路由配置
export const normalRoutes = [
    {
        path: "/auth",
        redirect: "/auth/login",
        component: AuthLayout,
        meta: {},
        children: [
            {
                path: "login",
                component: () => import("../views/auth/Login.vue"),
                meta: {}
            }
        ]
    },
]