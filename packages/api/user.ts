import generatorService from "../utils/generatorService";
import { ApiRequestConfig } from "../types/apiTypes"
import { UserApiParams as User } from "../types/userTypes";

const login: ApiRequestConfig<User.Login> = {
    url: "/accounts/login",
    method: "POST"
}

const register: ApiRequestConfig<User.Register> = {
    url: "/accounts/register",
    method: "POST"
}

const adminLogin: ApiRequestConfig<User.AdminLogin> = {
    url: "/admin/login",
    method: "POST",
}

const getAllUser: ApiRequestConfig<User.GetAllUsers> = {
    url: "/users",
    method: "GET",
    token: true
}

const getAdminUserMe: ApiRequestConfig<{}> = {
    url: "/admin/login",
    method: "GET",
    token: true
}

export default generatorService({
    login,
    register,
    adminLogin,
    
    getAllUser
});