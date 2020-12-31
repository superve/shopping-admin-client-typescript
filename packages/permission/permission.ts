import { Roles }  from "./config";
import * as _ from "lodash";

interface roleScheme {
    id?: number
    name: string
    descriptions?: string
    code?: string
}

/**
 * 根据角色名字计算角色的权限值
 * 
 * @param {string} name 
 * @returns {number}
 */
function computePermission (name: string): number {
    const perms = Roles[name];
    if (!Array.isArray(perms)) {
        throw new Error("自定义错误：未找到用户角色。");
    }
    return perms.reduce((first, next) => {
        return first + next;
    })
}

/**
 * 根据角色计算角色的权限值
 * 
 * @param {string | object | array} role 角色名，角色对象，多个角色对象
 * @returns {number}
 */
// export function permissionByName (role: string): number {
//     return computePermission(role);
// }

// export function permissionByRole (role: roleScheme ): number {
//     return computePermission(role.name);
// }

// export function permissionByRoles (roles : Array<roleScheme>): number {
//     let perms:number[] = [];
//     roles.forEach(item => {
//         perms.push(computePermission(item.name))
//     })
//     // 找出最大值
//     return perms.sort((a, b) => b - a)[0];
// }

/**
 * 根据角色计算角色的权限值（方法重载）
 * 
 * @param {string | object | array} role 角色名，角色对象，多个角色对象
 * @returns {number}
 */
export function addPermission(role: string): number;
export function addPermission(role: roleScheme): number;
export function addPermission(role: Array<roleScheme>): number;
export function addPermission(role: any): any {
    // role是角色名字
    if (typeof role === "string") {
        return computePermission(role)
    }
    // user.role是一个对象
    else if (_.isPlainObject(role) && role.name) {
        // 角色对应的值
        return computePermission(role.name)
    }
    // user.roles是一个数组，具有多个角色
    else if (role && Array.isArray(role)) {
        let perms:number[] = [];
        role.forEach(item => {
            perms.push(computePermission(item.name))
        })
        // 找出最大值
        return perms.sort((a, b) => b - a)[0];
    }else {
        throw new Error("自定义错误：角色名格式错误。")
    }
}

/**
 *  判断用户角色的权限
 * 
 * @param perm Permissions下的权限字段
 * @returns {boolean}
 */
type HasPermission = (userPerm: number, perm: number) => boolean;
export const hasPermission:HasPermission = (userPerm, perm) => {
    return (userPerm & perm) == perm;
}
