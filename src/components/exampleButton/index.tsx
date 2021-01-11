import { defineComponent } from "vue";
import styles from "./index.module.less";
// import { Button } from "ant-design-vue";

// import Button2 from "./index.vue";

export default defineComponent({
    render() {
        return <div class={styles.red}>
            something button
            {/* !是not null的断言 */}
            { this.$slots.default!() }
            {/* <Button type="primary">123123</Button> */}
        </div>
    }
})
