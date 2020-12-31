/**
 * 这样设计主要为了方便尽可能的兼容各种系统的兼容，
 * 在对接其他系统时只需要根据系统定制对应的权限和角色列表。
 */

 // 权限列表
export const Permissions: Record<string, number> = {
    PUBLIC: 1,      // 游客
    AUTHED: 2,      // 普通登录用户权限
    AUTHOR: 4,      // 管理个人业务数据权限 
    CHARGE: 8,      // 管理全部业务数据权限 
    MANAGER: 16,     // 管理所有人员 
    // TBD: 32,
    // TBD: 64,
    // ...
    ADMIN: 256      // 管理员，处理财务数据，比如退款 
}

// 角色列表
export const Roles: Record<string, Array<number>> = {
    // 登录用户，针对前台应用
    Authenticated: [  
        Permissions.PUBLIC,      
        Permissions.AUTHED
    ], 
    // 后台管理用户，只能管理自己的数据 (普通员工)
    Author: [            
        Permissions.PUBLIC,   
        Permissions.AUTHED, 
        Permissions.AUTHOR
    ],    
    // 后台管理用户，可以管理他人数据 (主管)   
    Editor: [      
        Permissions.PUBLIC,         
        Permissions.AUTHED, 
        Permissions.AUTHOR, 
        Permissions.CHARGE
    ],  
    // 超级管理员   (经理)（BOSS）                                       
    "Super Admin": [  
        Permissions.PUBLIC,      
        Permissions.AUTHED, 
        Permissions.AUTHOR, 
        Permissions.CHARGE,
        Permissions.MANAGER,
        Permissions.ADMIN
    ]                                    
}