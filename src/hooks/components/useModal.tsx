import { defineComponent, ref, toRefs, unref } from "vue";
import { Modal } from "ant-design-vue";
import propTypes, { array, string } from "vue-types";

type ModalProps = {
    title: string
}

export default function useModal() {
    const visible = ref<boolean>(false);
    function triggerVisible() {
        visible.value = !visible.value;
    }

    const Dialog = defineComponent({
        inheritAttrs: true, // 默认继承所有属性
        setup(props: ModalProps) {
            return {
                ...toRefs(props)
            }
        },
        props: {
            title: string().def()
        },
        methods: {
            handleOk() {
                this.$emit("yes");
            },
            handleCancel() {
                this.$emit("no");
            }
        },
        render() {
            const { title, handleOk } = this;
            const visibleValue = unref(visible)

            return <Modal
            visible={visibleValue}             
            title={title}
            onOk={handleOk}
            onCancel={triggerVisible}
            okText="确定"
            cancelText="取消"
            >
                { this.$slots.default }
            </Modal>
        }
    })

    return {
        visible,
        Dialog,
        triggerVisible
    }
}