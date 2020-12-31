import { resolve } from "path";

export default () => {
    return {
        // alias: {
        //     "@/": resolve(__dirname, '.', 'src')
        // },
        optimizeDeps: {
            include: [
                'lodash',
                'ant-design-vue/es/locale/zh_CN',
                'ant-design-vue/es/locale/en_US',
                '@ant-design/icons-vue',
            ],
        },
    }
}