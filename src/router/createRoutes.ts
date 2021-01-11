
import { RouteRecordRaw, Router } from "vue-router";
import * as _ from "lodash";

import { hasPermission } from "../../packages/permission/permission";
import { Permissions } from "../../packages/permission/config"
import { getUserInfo } from "../../packages/utils/storage";
import { menusRoutes } from "./router.config";

/**
 * generator routers
 */
export function generatorRoutes (
    routes: RouteRecordRaw[], 
    parentRoute?: RouteRecordRaw
): RouteRecordRaw[] {
    // 用户信息
    const userInfo = getUserInfo();

    return routes.filter((route) => {
        if (_.isPlainObject(route.meta) === false) {
            throw new Error("自定义错误：route.meta 配置必须为对象。")
        }
        
        // 子路由继承父路由的策略
        let allPolices = route.meta!.policies || [];
        if ( parentRoute ) {
            allPolices = allPolices.concat(parentRoute.meta!.policies);
        }
        route.meta!.policies = [...new Set(allPolices)];

        const { policies } = route.meta!;
        let isPerm = false;
        // 循环角色权限策略
        if ( Array.isArray(policies) ) {
            isPerm = policies.every(pol => {
                // 判断当前用户必须满足所有权限
                const perm = Permissions[pol];
                // some的判断，只要有一个为true即为true
                return hasPermission(userInfo.permission, perm);
            })
        }

        if ( Array.isArray(route.children) ) {
            route.children = generatorRoutes(route.children, route);
        }

        return isPerm;
    })
}

function createRoutes(router: Router) {
    // 深度克隆对象，防止修改
    const copyMenusRoutes = _.cloneDeep(menusRoutes);
    // 根据权限过滤路由配置
    const newRoutes = generatorRoutes(copyMenusRoutes);
    newRoutes.forEach(route => {
        router.addRoute(route);
    });
}

export default createRoutes;