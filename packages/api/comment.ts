import generatorService from "../utils/generatorService";
import { ApiRequestConfig as Api } from "../utils/http/types"
import { CommentTypes } from "./types/commentTypes";

// 新增管理员
const getComments: Api<CommentTypes.GetComments>  = {
    url: "/comments",
    method: "GET",
    token: true
}

const createComments: Api<CommentTypes.Comment> = {
    url: "/comments",
    method: "POST",
    token: true
}

const updateComment: Api<CommentTypes.Comment> = {
    url: "/comments/:id",
    method: "PUT",
    token: true
}

export default generatorService({
    getComments,
    createComments,
    updateComment
});