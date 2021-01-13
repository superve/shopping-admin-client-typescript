import { createVNode, VNode } from "vue";
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from "ant-design-vue";

export enum Status {
    SUCCESS = "sucess",
    WARNING = "warning",
    ERROR = "error"
}

interface ConfirmType {
    title: string
    content?: string
    status: Status
}

const icons: Record<string, VNode> = {
    [Status.WARNING]: createVNode(ExclamationCircleOutlined)
}

function confirm(data: ConfirmType) {
    const icon = icons[data.status];
    return new Promise((resolve, reject) => {
        Modal.confirm({
            title: data.title,
            icon: icon,
            content: data.content,
            okText: "确定",
            cancelText: "取消",
            onOk: (v) => {
                resolve(v);
            },
            onCancel: () => {
                reject();
            }
        })
    });
}

function useConfirm(data: ConfirmType) {
    return confirm(data);
}

useConfirm.warn = function(title: string, content?: string){
    return confirm({
        title,
        content,
        status: Status.WARNING
    });
}

export default useConfirm;