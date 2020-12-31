import api from "../packages/api/user"

test("测试登录接口", done => {
    api.adminLogin({
        email: "1050156031@qq.com",
        password: "Zz123456"
    }).then(res => {
        expect(res.data.user.email).toBe("1050156031@qq.com")
        done();
    })
})
