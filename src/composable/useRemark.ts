import { ref, reactive, onMounted } from "vue";

import { RemarkData, remarkService } from "../api/remark";

export function useRemark() {
    const selectedRemarkId = ref(0);
    const remarkDatas = ref<RemarkData[]>([]);
    const messages = reactive({
        add: "",
        edit: "",
        delete: "",
    });
    const initialRemarkForm = { Remarks_ID: 0, Remarks: "" };
    const remarkForm = ref({ ...initialRemarkForm });

    const resetRemarkForm = () => {
        remarkForm.value = { ...initialRemarkForm };
    };
    //load
    const loadRemarks = async () => {
        try {
            const response = await remarkService.getRemarks();
            remarkDatas.value = response.data;
        } catch (err) {
            console.error("Error loading remarks:", err);
        }
    };

    //save
    const saveRemark = async (isEdit: boolean) => {
        if (!remarkForm.value.Remarks) {
            messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
            return;
        }

        try {
            if (isEdit) {
                if (!selectedRemarkId.value) {
                    messages.edit = "No remark selected.";
                    return;
                }
                await remarkService.updateRemark(selectedRemarkId.value, {
                    remark: remarkForm.value.Remarks
                });
                (document.getElementById("editRemarkModal") as HTMLDialogElement).close();
            } else {
                await remarkService.createRemark({
                    remark: remarkForm.value.Remarks
                });
                (document.getElementById("addRemarkModal") as HTMLDialogElement).close();
            }
            loadRemarks();
        } catch (err) {
            console.error("Error saving remark:", err);
            messages[isEdit ? "edit" : "add"] = "Error saving remark.";
        }
    };
    //DELETE
    const deleteRemark = async () => {
        if (!selectedRemarkId.value) {
            messages.delete = "No remark selected.";
            return;
        }
        try {
            await remarkService.deleteRemark(selectedRemarkId.value);
            loadRemarks();
            (document.getElementById("deleteRemarkModal") as HTMLDialogElement).close();
        } catch (err) {
            console.error("Error deleting remark:", err);
            messages.delete = "Error deleting remark.";
        }
    };

    onMounted(loadRemarks);

    return { loadRemarks,resetRemarkForm,selectedRemarkId, remarkDatas, remarkForm, messages, saveRemark, deleteRemark };
}    