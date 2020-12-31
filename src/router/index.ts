import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { normalRoutes } from "./router.config";
import createRoutes from "./createRoutes";
import defaultGuard from "./guards/defaultGuard";

const router = createRouter({
    history: createWebHashHistory(),
    routes: normalRoutes
});

createRoutes(router);
defaultGuard(router);

export default router;