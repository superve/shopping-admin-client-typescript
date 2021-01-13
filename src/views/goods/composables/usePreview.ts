import {ref} from "vue";
import getBase64 from "../../../../packages/utils/getBase64";

export default function usePreview() {
    const previewVisible = ref(false);
    const previewImage = ref("");

    async function handlePreview(file: File | any) {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        previewImage.value = file.url || file.preview;
        previewVisible.value = true;
    }

    function handleCancelPreview() {
        previewVisible.value = false;
    }

    return {
        previewVisible,
        previewImage,
        handlePreview,
        handleCancelPreview
    }
}