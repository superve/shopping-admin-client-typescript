import { Module } from "vuex"

import roleApi from "../../api/role";
// import { UserState } from "../types/stateTypes";
// import { UserParams } from "../../api/types/userTypes";

const role: Module<{}, any> = {
    namespaced: true,
    state: {

    },
    mutations: {
        
    },
    actions: {
        getAdminRoles({ commit }) {
            return new Promise((resolve, reject) => {
                roleApi.getAdminRoles({})
                    .then(res => {
                        resolve(res.data);
                    })
            })
        }
    }
}

export default role;