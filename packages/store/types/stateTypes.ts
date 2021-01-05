export interface UserState {
    token?: string
    user: {
        permission: number
    },
    allUsers: Array<{}>
}
