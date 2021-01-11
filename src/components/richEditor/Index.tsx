
import { defineComponent, ref, unref, onMounted } from "vue";
import Quill from "quill";
import { editorProps, EditorProps } from "./types";
import defaultToolbar from "./default-toolbar";

import "quill/dist/quill.snow.css";
import "./index.less"

export default defineComponent({
    setup(props: EditorProps, { emit }) {
        const { editorToolbar, placeholder, disabled, base64Image } = props;
        const fileInputRef = ref<any>(null);
        let quillInstance: Quill | any = null;

        const editorConfig = {
            debug: false,
            modules: {
                toolbar: editorToolbar && editorToolbar.length ? 
                    editorToolbar : 
                    defaultToolbar
            },
            theme: "snow",
            placeholder: placeholder || "",
            readOnly: !!disabled
        };

        function setupEditor() {
            quillInstance = new Quill("#quill", editorConfig);
            setupImageHandler();
            setupEditorValue();
            quillInstance.on("text-change", handleTextChange);
        }

        function setupImageHandler () {
            if (base64Image) return;
            const toolbar = quillInstance.getModule("toolbar");
            toolbar.addHandler("image", () => {
                const fileInput = unref(fileInputRef);
                fileInput.click();
            }); 
        }

        function setupEditorValue() {
            const { value } = props;
            if (value) {
                quillInstance.root.innerHTML = value;
            }
        }

        function handleTextChange() {
            let editorContent =
                quillInstance.root.innerHTML === "<p><br></p>" ? "" : quillInstance.root.innerHTML;
            emit("update:value", editorContent);
        }

        function handleImageChange(event: Event | any) {
            const resetUploader = () => {
                const fileInput = unref(fileInputRef);
                fileInput.value = "";
            };
            let file = event.target.files[0];
            let range = quillInstance.getSelection(true);
            let cursorLocation = range.index;
            emit("uploadImage", file, quillInstance, cursorLocation, resetUploader);
        }

        onMounted(() => {
            setupEditor();
        });

        return {
            fileInputRef,
            handleImageChange
        }
    },
    props: editorProps(),
    render() {
        const { base64Image } = this;
        return <div class="quillWrapper">
            <div id="quill" ref="quillRef"></div>
            {
                !base64Image && <input
                    id="file-upload"
                    ref="fileInputRef"
                    type="file"
                    accept="image/*"
                    style="display:none;"
                    onChange={(e) => { this.handleImageChange(e) }} /> 
            }
        </div>
    }
});
