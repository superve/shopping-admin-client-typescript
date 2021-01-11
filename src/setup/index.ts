import { ComponentOptions } from "vue";
import resErrorHandler from "./errorHandler";

const setup = {
    install (app: ComponentOptions) {
        resErrorHandler();
    }
};

export default setup;
