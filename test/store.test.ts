import store from "../packages/store/index"

test("测试store action的登录服务", done => {
    store.dispatch("user/adminLogin", {
        email: "1050156031@qq.com",
        password: "Zz123456"
    }).then(res => {
        expect(store.state.user.user.email).toBe("1050156031@qq.com")
        done();
    })
})
