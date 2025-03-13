import { computed, ref, reactive, onMounted } from "vue";
import { SupplyData, supplyService } from "../api/supply";
import { AxiosError } from "axios";

export function useSupply() {
    const selectedSupplyId = ref<number>(0);
    const supplySearch = ref({"name":""});
    const supplyDatas = ref<SupplyData[]>([]);
    const messages = reactive({ edit: "", add: "", delete: "" });
    const initialSupplyForm = {
        Supply_ID: 0,
        Supplier_id: 0,
        Employee_id: 0,
        Supply_date: "",
        Supplier_Name: "",
        Employee_Name: ""
    }
    const supplyForm = ref({ ...initialSupplyForm });

    const filteredSupplyDatas = computed(() =>
        supplyDatas.value.filter(({ Supplier_Name }) =>
            Supplier_Name.toLowerCase().includes(supplySearch.value.name.toLowerCase())
        )
    );

    //Reset Form
    const resetSupplyForm = () => {
        supplyForm.value = { ...initialSupplyForm };
    };
    //Load
    const loadSupply = async () => {
        try {
            const response = await supplyService.getSupplies();
            supplyDatas.value = response.data;
        } catch (err) {
            console.error("Error loading supplies:", err);
        }
    };
    //Save
    const saveSupply = async (isEdit: boolean) => {
        if (!supplyForm.value.Supplier_id) {
            messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
            return;
        }
        try {
            if (isEdit) {
                if (!selectedSupplyId.value) {
                    messages.edit = "No supply selected.";
                    return;
                }
                await supplyService.updateSupply(selectedSupplyId.value,{
                    supplierId: supplyForm.value.Supplier_id,
                    supplyDate: supplyForm.value.Supply_date
                });
                messages.edit='';
                (document.getElementById("editSupplyModal") as HTMLDialogElement).close();
            } else {
                await supplyService.createSupply({
                    supplierId: supplyForm.value.Supplier_id,
                    supplyDate: supplyForm.value.Supply_date
                });
                messages.add='';
                (document.getElementById("addSupplyModal") as HTMLDialogElement).close();
            }
            loadSupply();
        } catch (err:AxiosError | any) {
            messages[isEdit ? "edit" : "add"] = err.response.data.message;
        }
    };
    //Delete
    const deleteSupply = async () => {
        if (!selectedSupplyId.value) return (messages.delete = "No supply selected.");
        try {
            await supplyService.deleteSupply(selectedSupplyId.value);
            (document.getElementById("deleteSupplyModal") as HTMLDialogElement).close();
            loadSupply();
        } catch (err: AxiosError | any) {
            messages.delete = err.response.data.message;
        }
    };

    onMounted(loadSupply);

    return {
        resetSupplyForm,
        supplyDatas,
        filteredSupplyDatas,
        loadSupply,
        saveSupply,
        deleteSupply,
        selectedSupplyId,
        supplyForm,
        messages,
        supplySearch
    };
}