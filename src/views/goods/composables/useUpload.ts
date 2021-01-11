import uploadApi from "../../../../packages/api/upload";

export default async function useUpload(file: File) {
    const formData = new FormData();
    formData.append("files", file);
    const result = await uploadApi.upload(formData);
    return Promise.resolve(result);
}