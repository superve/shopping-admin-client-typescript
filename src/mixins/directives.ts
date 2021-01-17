import moment from "moment";

const directivesMixin = {
    directives: {
        dateformat: {
            mounted(el: HTMLElement) {
                el.innerHTML = moment(el.innerHTML).format("YYYY-MM-DD hh:mm:ss");
            }
        }
    }
}

export default directivesMixin;