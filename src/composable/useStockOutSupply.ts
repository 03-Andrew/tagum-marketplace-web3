import { ref, reactive, onMounted } from "vue";

import { StockOutSupplyData, stockOutSupplyService } from "../api/stockOutSupply";

export function useStockOutSupply() {
    const selectedStockOutSupplyId = ref(0);
    const stockOutSupplies = ref<StockOutSupplyData[]>([]);
    const stockOutSupplyForm = reactive<StockOutSupplyData>({
        StockOut_ID: 0,
        SupplyDetail_ID: 0,
        Employee_ID: 0,
        Remarks_ID: 0,
        StockOut_Date: ""
    });
    const messages = reactive({
        add: "",
        edit: "",
        delete: "",
    });

    //load
    const loadStockOutSupplies = async () => {
        try {
            const response = await stockOutSupplyService.getStockOutSupplies();
            stockOutSupplies.value = response.data;
        } catch (err) {
            console.error("Error loading stock out supplies:", err);
        }
    };

    //save
    const saveStockOutSupply = async (isEdit: boolean) => {
        if (!stockOutSupplyForm.SupplyDetail_ID || !stockOutSupplyForm.Remarks_ID) {
            messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
            return;
        }

        try {
            if (isEdit) {
                if (!selectedStockOutSupplyId.value) {
                    messages.edit = "No stock out supply selected.";
                    return;
                }
                await stockOutSupplyService.updateStockOutSupply(selectedStockOutSupplyId.value, {
                    supplyDetailId: stockOutSupplyForm.SupplyDetail_ID,
                    remarksId: stockOutSupplyForm.Remarks_ID,
                });
               // (document.getElementById("editStockOutSupplyModal") as HTMLDialogElement).close();
            } else {
                await stockOutSupplyService.createStockOutSupply({
                    supplyDetailId: stockOutSupplyForm.SupplyDetail_ID,
                    remarksId: stockOutSupplyForm.Remarks_ID,
                });
                (document.getElementById("removeSupplyDetailModal") as HTMLDialogElement).close();
            }
            loadStockOutSupplies();
        } catch (err) {
            console.error("Error saving stock out supply:", err);
            messages[isEdit ? "edit" : "add"] = "Error saving stock out supply.";
        }
    };

    //DELETE
    const deleteStockOutSupply = async () => {
        if (!selectedStockOutSupplyId.value) {
            messages.delete = "No stock out supply selected.";
            return;
        }
        try {
            await stockOutSupplyService.deleteStockOutSupply(selectedStockOutSupplyId.value);
            loadStockOutSupplies();
        } catch (err) {
            console.error("Error deleting stock out supply:", err);
            messages.delete = "Error deleting stock out supply.";
        }
    };

    onMounted(loadStockOutSupplies);

    return {
        selectedStockOutSupplyId,
        stockOutSupplies,
        stockOutSupplyForm,
        messages,
        loadStockOutSupplies,
        saveStockOutSupply,
        deleteStockOutSupply,
    };
}

