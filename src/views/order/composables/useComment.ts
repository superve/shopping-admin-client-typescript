import order from "packages/api/order";
import { ref } from "vue";
import commentApi from "../../../../packages/api/comment"
import { CommentTypes } from "../../../../packages/api/types/commentTypes";

export default function useComment() {
    const commentsData = ref<any[]>([]);
    const replayData = ref<CommentTypes.Comment>({})

    async function fetchCommentsByOrder(orderId: string | number) {
        const params: CommentTypes.GetComments = {
            order: orderId,
            level: 1
        }
        const result = await commentApi.getComments(params);
        if(Array.isArray(result)) {
            commentsData.value = result;
        }
    }

    async function handleReplyComment(data: CommentTypes.Comment) {
        const result = await commentApi.createComments(data);
        return result;
    }

    async function handleUpdateComment(data: CommentTypes.Comment) {
        const result = await commentApi.updateComment(data, {
            url: "/comments/" + data.id
        });
        return result;
    }

    return {
        commentsData,
        fetchCommentsByOrder,
        replayData,
        handleReplyComment,
        handleUpdateComment
    }
}