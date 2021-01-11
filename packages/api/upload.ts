import generatorService from "../utils/generatorService";
import { ApiRequestConfig as Api } from "../utils/http/types"
import { Upload } from  "./types/upload"

// 新增管理员
const upload: Api<Upload>  = {
    url: "/upload",
    method: "POST",
    token: true
}

export default generatorService({
    upload
});