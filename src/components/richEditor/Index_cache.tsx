import { defineComponent, DirectiveArguments, onMounted, ref, toRef, unref, watch } from "vue";
import Quill, { DeltaOperation, RangeStatic } from "quill";
// import { DeltaType } from "./Editor";
import defaultToolbar from "./default-toolbar";
import { editorProps, EditorProps } from "./types";
import "quill/dist/quill.snow.css";
import "./index.less";

export default defineComponent({
    setup(props: EditorProps, { emit }) {
        const { editorToolbar, placeholder, disabled, base64Image } = props;
        const quillRef = ref<any>(null);
        const fileInputRef = ref<any>(null);
        const quillInstance = ref<Quill | any>(null);
        // const editorValue = toRef(props, "value");

        const editorConfig = {
            debug: false,
            modules: {
                toolbar: editorToolbar && editorToolbar.length ? editorToolbar : defaultToolbar
            },
            theme: "snow",
            placeholder: placeholder || "",
            readOnly: !!disabled
        };

        function customImageHandler() {
            //const fileInput = unref(fileInputRef);
            //fileInput.click();

            const instance = unref(quillInstance);
            let range = instance.getSelection(true);
            let cursorLocation = range.index;
            instance.insertEmbed(cursorLocation, "image", `https://www.baidu.com/img/flexible/logo/pc/result.png`);
        }

        function setupImageHandler() {
            // use base64 format image!
            if (base64Image) return;
            const instance = unref(quillInstance);
            const toolbar = instance.getModule("toolbar");
            toolbar.addHandler("image", customImageHandler);
        }

        // function setupEditorValue() {
        //     const { value } = props;
        //     const instance = unref(quillInstance);
        //     if (value) {
        //         instance.root.innerHTML = value;
        //     }
        // }

        // function registerEditorEvents() {
        //     const instance = unref(quillInstance);
        //     instance.on("text-change", handleTextChange);
        //     instance.on("selection-change", handleSelectionChange);
        //     listenForEditorEvent("text-change");
        //     listenForEditorEvent("selection-change");
        //     listenForEditorEvent("editor-change");
        // }

        // function listenForEditorEvent(type: string) {
        //     const instance = unref(quillInstance);
        //     instance.on(type, (...args: any) => {
        //         emit(type, ...args);
        //     });
        // }

        // function handleSelectionChange(range: RangeStatic, oldRange: RangeStatic) {
        //     const instance = unref(quillInstance);
        //     if (!range && oldRange) emit("blur", instance);
        //     else if (range && !oldRange) emit("focus", instance);
        // }

        // function handleTextChange(delta: DeltaType, oldContents: string) {
        //     const instance = unref(quillInstance);
        //     let editorContent =
        //         instance.root.innerHTML === "<p><br></p>" ? "" : instance.root.innerHTML;
        //     emit("update:value", editorContent);
        //     // if (!base64Image) {
        //     //     handleImageRemoved(delta, oldContents);
        //     // }
        // }

        // function handleImageRemoved(delta: DeltaType, oldContents: string) {
        //     const instance = unref(quillInstance);
        //     const currrentContents = instance.getContents();
        //     const deletedContents = currrentContents.diff(oldContents);
        //     const operations = deletedContents.ops;

        //     console.log(operations  )

        //     operations.map((operation: DeltaOperation) => {
        //         if (operation.insert && operation.insert.hasOwnProperty("image")) {
        //             const { image } = operation.insert;

        //             console.log(image)

        //             emit("image-removed", image);
        //         }
        //     });
        // }

        function setupEditor() {
            const quill = unref(quillRef);
            quillInstance.value = new Quill(quill, editorConfig);
        }

        onMounted(() => {
            setupEditor();
            setupImageHandler();
            //setupEditorValue();
            // registerEditorEvents();
        });

        // watch(editorValue, (newValue) => {
        //     const instance = unref(quillInstance);
        //     if(instance) {
        //         if(newValue != instance.root.innerHTML) {
        //             instance.root.innerHTML = newValue;
        //         }
        //     }
        // })

        return {
            quillRef,
            fileInputRef,
            quillInstance,
        }
    },
    props: editorProps(),
    methods: {
        handleImageChange(event: Event | any) {
            const resetUploader = () => {
                const fileInput = unref(this.fileInputRef);
                fileInput.value = "";
            };
            let file = event.target.files[0];
            let range = this.quillInstance.getSelection(true);
            let cursorLocation = range.index;
            this.$emit("uploadImage", file, this.quillInstance, cursorLocation, resetUploader);
        }
    },
    render() {
        const { base64Image } = this;
        return <div class="quillWrapper">
            <div id="quill" ref="quillRef"></div>
            {/* <input
                    id="file-upload"
                    ref="fileInputRef"
                    type="file"
                    accept="image/*"
                    style="display:none;"
                    onChange={(e) => { this.handleImageChange(e) }} /> */}
            
        </div>
    }
})
