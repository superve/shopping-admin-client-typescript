import { ApiRequestConfig } from "./apiTypes";

export declare namespace StoreTypes {
    interface State {
        token?: string
        user: {
            permission: number
        },
        allUsers: Array<{}>
    }
}

export declare namespace UserApiParams {
    interface Login {
        username: string
        verify_code: string
    }

    interface Register {
        username: string
        verify_code: string
        password: string
    }

    interface AdminLogin {
        email: string
        password: string
    }

    interface GetAllUsers {
        _limit: number
        _start: number
        id_contains?: string | number
        username_contains?: string
        email?: string
    }
}
