export declare namespace UserParams {
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

    interface GetUsers {
        _limit: number
        _start: number
        id_contains?: string | number
        username_contains?: string
        email?: string
    }

    interface GetAdmin {
        pageSize: number
        page: number
        id_contains?: string | number
        firstname_contains?: string
        lastname_contains?: string
        email?: string
    }

    interface CreateAdmin {
        firstname: string
        lastname: string
        email: string
        roles: Array<number>
        isActive?: boolean
        username?: string
    }

    interface getById {
        data?: object
        url?: string
    }

    interface EditeAdmin {
        data: CreateAdmin,
        url: string
    }
}


