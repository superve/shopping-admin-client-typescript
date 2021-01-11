import propTypes, { array, number, string, bool } from "vue-types";
import { ExtractPropTypes } from "vue"
import Quill from "quill";

export const editorProps = () => ({
    editorToolbar: array().def([]),
    placeholder: propTypes.string,
    disabled: bool().def(false),
    base64Image: bool().def(false),
    value: propTypes.string
})

export type Editor = Quill;
export type EditorProps = Partial<ExtractPropTypes<ReturnType<typeof editorProps>>>;