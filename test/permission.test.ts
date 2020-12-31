import { addPermission } from "../packages/permission/permission";

test("测试计算后台管理角色，数组类型权限", () => {
    const roles = [
        { name: "Author"},
        { name: "Editor"}
    ]
    const perm = addPermission(roles);
    expect(perm).toBe(15)
})

test("测试计算后台管理角色，对象类型权限", () => {
    const perm = addPermission({
        name: "Editor"
    });
    expect(perm).toBe(15)
})

test("测试计算后台管理角色，字符串类型权限", () => {
    const perm = addPermission("Editor");
    expect(perm).toBe(15)
})