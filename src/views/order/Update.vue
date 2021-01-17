<template>
    <div>
        <h4>订单信息</h4>
        <p>购买用户：
            <router-link to="#">
                    {{orderItem.user && orderItem.user.username}}
            </router-link>
        </p>
        <p>订单号码：{{orderItem.out_trade_no}}</p>
        <p>订单状态：
            <a-tag v-if="orderItem.order_type" 
            :color="orderTypes[orderItem.order_type.id - 1].color">
                {{ orderItem.order_type.name }}
            </a-tag>
        </p>
        <p>订单操作：
            <!-- 这里的id和orderTypes创建的数组强关联 -->
            <template v-if="orderItem.order_type">
                <a-button v-for="(item, index) in orderTypes[orderItem.order_type.id - 1].actions"
                :key="index"
                :type="item.btnType"
                size="small"
                style="margin-right: 5px"
                @click="handleAction(item.action, orderItem)">
                    {{item.name}}
                </a-button>
            </template>
        </p>
        <p>客户备注：{{orderItem.remark}}</p>
        <a-divider dashed/>

        <h4>商品列表</h4>
        <a-table 
        :data-source="orderItem.skuses" 
        rowKey="id"
        :pagination="false"
        >
            <a-table-column title="商品">
                <template #default="{record}">
                    <a-avatar 
                    v-if="record.cover"
                    shape="square"
                    :src="request.defaults.baseURL + record.cover.url" />
                    <a-divider type="vertical" />
                    {{record.goods_name}}
                </template>
            </a-table-column>
            <a-table-column title="单价" key="price" data-index="price"/>
            <a-table-column title="SKU">
                <template #default="{record}">
                    {{ record.type_1_name }}: {{ record.type_1 }}
                    <a-divider type="vertical" />
                    {{ record.type_2_name }}: {{ record.type_2 }}
                    <a-divider type="vertical" />
                    {{ record.type_3_name }}: {{ record.type_3 }}
                </template>   
            </a-table-column>
            <a-table-column title="数量">
                <template #default="{record}">
                    {{orderItem.counts_map[record.id]}}
                </template>   
            </a-table-column>
        </a-table>
        <a-divider dashed/>

        <template v-if="orderItem.order_type && 
            orderItem.order_type.id > 2 && 
            orderItem.order_type.id < 6
            ">
            <h4>订单评论</h4>
            <a-table 
            :data-source="commentsData" 
            rowKey="id"
            :pagination="false"
            childrenColumnName="children_comments"
            defaultExpandAllRows
            >
                <a-table-column title="展开"/>
                <a-table-column title="详情">
                    <template #default="{record}">
                        <div>{{record.content}}</div>
                        <template v-if="record.comment_media && record.comment_media.length > 0">
                            <a-avatar 
                            v-for="(item, index) in record.comment_media" 
                            :key="index"
                            shape="square"
                            :src="request.defaults.baseURL + item.url" 
                            style="margin-top: 5px"/>
                            <a-divider type="vertical" />
                        </template>
                    </template>
                </a-table-column>
                <a-table-column title="时间">
                    <template #default="{record}">
                        <span v-dateformat>{{record.created_at}}</span>
                    </template>
                </a-table-column>
                <a-table-column title="操作" :width="200">
                    <template #default="{record}">
                        <div v-if="record.level === 1">
                            <a-button size="small" type="primary" @click="handleReply(record)">回复</a-button>
                            <a-divider type="vertical" />
                            <a-button size="small" @click="handleTrigger(record)">
                                {{ record.blocked ? "关闭" : "打开" }}
                            </a-button>
                        </div>
                        <div v-else>
                            管理员回复
                        </div>
                    </template>
                </a-table-column>
            </a-table>
            <a-input-search
                v-show="showReply"
                style="margin-top: 20px"
                v-model:value="replyValue"
                placeholder="请输入回复的评论"
                enter-button="确定回复"
                size="default"
                @search="handleReplySubmit"
                @blur="handleReplyBlur"
            />

            <a-divider dashed/>
            <h4>物流信息</h4>
            <p>物流公司： 
                <a-avatar 
                shape="square"
                :src="logisticsData.result.logo"></a-avatar>
                {{logisticsData.result.expName}}
            </p>
            <p>物流状态：{{
                ['在途中', "正在派件", "已签收", "派送失败", "疑难件", "退件签收"]
                [logisticsData.result.deliverystatus] 
            }}</p>
            <p v-for="(item, index) in logisticsData.result.list"
            :key="index">
                <span>{{item.time}}</span>
                <a-divider type="vertical" />
                <span>{{item.status}}</span>
            </p>
        </template>

        <OrderDeliver @deliver="handleDeliver"/>
        <OrderRefund :data="actionCurrent" @refund="handleRefund" />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import * as _ from "lodash";
import {AxiosInstance} from "axios";
import { useRoute } from "vue-router";

import useOrder from "./composables/useOrder";
import useOrderTypes from "./composables/useOrderTypes";
import useComment from "./composables/useComment";

import OrderDeliver from "./components/OrderDeliver.vue";
import OrderRefund from "./components/OrderRefund.vue";
import useMessage from "../../hooks/components/useMessage";
import useConfirm from "../../hooks/components/useConfirm";

import request from "../../../packages/utils/http/request";
import { PayTypes } from "../../../packages/api/types/payTypes"
import { OrderTypes } from "../../../packages/api/types/orderTypes"
import { CommentTypes } from "../../../packages/api/types/commentTypes";

import directivesMixin from "../../mixins/directives";
import logisticsData from "./mock/logistics";

const { success, error } = useMessage();
const { useWarnConfirm } = useConfirm();

export default defineComponent({
    setup() {
        const route = useRoute();
        const {
            orderItem,
            fetchOrderById,
            handleUpdateOrder,
            handleOrderRefund
        } = useOrder();

        const {
            orderTypes
        } = useOrderTypes();

        const {
            commentsData,
            fetchCommentsByOrder,
            replayData,
            handleReplyComment,
            handleUpdateComment
        } = useComment();

        onMounted(() => {
            fetchOrderById(route.params.id);
            fetchCommentsByOrder(Number(route.params.id));
        });

        return {
            orderItem,
            orderTypes,
            fetchOrderById,
            fetchCommentsByOrder,
            handleUpdateOrder,
            handleOrderRefund,
            commentsData,
            replayData,
            handleReplyComment,
            handleUpdateComment
        }
    },
    data(){
        return {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 },
            request,
            actionCurrent: {},
            replyCurrent: {},
            showReply: false,
            replyValue: "",
            logisticsData
        } as {
            labelCol: Record<string, any>
            wrapperCol: Record<string, any>
            request: AxiosInstance
            actionCurrent: OrderTypes.Order,
            replyCurrent: Record<string, any>,
            showReply: boolean,
            replyValue: string
        }
    },
    mixins: [directivesMixin],
    components: {
        OrderDeliver,
        OrderRefund
    },
    methods: {
        async handleAction(type: string, item: OrderTypes.Order) {
            this.actionCurrent = item;
            const orderActions: Record<string, Function> = {
                "cancel": async () => {
                    useWarnConfirm("确定取消关闭订单吗?").then(async () => {
                        try {
                            await this.handleUpdateOrder({
                                id: item.id,
                                order_type: 6 // 取消关闭订单
                            });
                            success("操作成功");
                            this.fetchOrderById(this.$route.params.id);
                        } catch (error) {}
                    });
                },
                "deliver": () => {
                    if(OrderDeliver.methods && OrderDeliver.methods.handleVisible) {
                        OrderDeliver.methods.handleVisible(); 
                    }
                },
                "refund": () => {
                    if(OrderRefund.methods && OrderRefund.methods.handleVisible) {
                        OrderRefund.methods.handleVisible(); 
                    }
                }
            }

            if(orderActions[type]) {
                orderActions[type]();
            }
        },
        async handleDeliver(data: OrderTypes.Order) {
            const params = Object.assign({}, this.actionCurrent, data);
            const newParams = _.pick(params, "id", "package_company", "package_number", "order_type");
            await this.handleUpdateOrder(newParams);
            success("操作成功");
            this.fetchOrderById(this.$route.params.id);
        },
        async handleRefund(data: PayTypes.Refund) {
            // 退款
            const result: Record<string, any> = await this.handleOrderRefund(data);
            if( result.msg === "Success" ) {
               // 更新
                await this.handleUpdateOrder({
                    id: this.actionCurrent.id,
                    order_type: 6
                });
                success("操作成功");
                this.fetchOrderById(this.$route.params.id);
            } else {
                error("操作失败: " + result.msg);
            } 
        },
        // 回复评论
        handleReply(item: CommentTypes.Comment) {
            this.replyCurrent = item;
            this.showReply = true;
        },
        // 回复输入框失去焦点
        handleReplyBlur() {
            if(this.replyValue.trim() === "") {
                this.showReply = false;
            }
        },
        // 发布回复
        async handleReplySubmit() {
            const data: CommentTypes.Comment = {
                order: this.orderItem.id,
                content: this.replyValue,
                parent_comment: this.replyCurrent.id,
                sku: this.replyCurrent.sku.id
            }

            const result = await this.handleReplyComment(data);
            success("发布成功");
            this.fetchCommentsByOrder(this.orderItem.id);
        },
        async handleTrigger(data: CommentTypes.Comment) {
            await this.handleUpdateComment({
                id: data.id,
                blocked: !data.blocked
            })
            success("操作成功");
            this.fetchCommentsByOrder(this.orderItem.id);
        }
    }
});
</script>

<style>
</style>