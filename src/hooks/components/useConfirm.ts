import { createVNode, VNode } from "vue";
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from "ant-design-vue";
import type { ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';

export enum Status {
    SUCCESS = "sucess",
    WARNING = "warning",
    ERROR = "error"
}

const icons: Record<string, VNode> = {
    [Status.WARNING]: createVNode(ExclamationCircleOutlined)
}

export default function useConfirm() {
    function createOptions(data: ModalFuncProps){
        return {
            ...data,
            okText: "确定",
            cancelText: "取消",
            onOk(){},
            onCancel(){}
        }
    }

    function useWarnConfirm (title: string, content?: string){
        const opts = createOptions({
            title,
            content,
            icon: icons[Status.WARNING],
        })

        return new Promise((resolve, reject) => {
            return Modal.confirm({
                ...opts,
                onOk(){
                    resolve({});
                },
                onCancel(){
                    reject();
                }
            })
        })
    }

    return {
        useWarnConfirm
    }
    
};