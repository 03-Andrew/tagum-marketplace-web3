import { computed, ref, reactive, onMounted } from "vue";
import { SaleData, saleService } from "../api/sale";

export function useSale() {
    const selectedSaleId = ref<number | null>(null);
    const saleSearch = ref("");
    const saleDatas = ref<SaleData[]>([]);
    const messages = reactive({ edit: "", add: "", delete: "" });
    const saleForm = reactive<SaleData>({
        id: 0,
        customerName: "",
        employeeName: "",
        customerId: 0,
        employeeId: 0,
        date: new Date(),
    });

    const filteredSaleDatas = computed(() =>
        saleDatas.value.filter(({ customerName }) =>
            customerName === null
                ? saleSearch.value === ''
                : customerName.toLowerCase().includes(saleSearch.value.toLowerCase() ?? '')
        )
    );
    //load
    const loadSale = async () => {
        try {
            const response = await saleService.getSales();
            saleDatas.value = response.data.map(({
                Sales_ID,
                Customer_ID,
                Employee_ID,
                Customer_Name,
                Employee_Name,
                Sales_Date
            }: any) => ({
                id: Sales_ID,
                customerId: Customer_ID,
                employeeId: Employee_ID,
                customerName: Customer_Name,
                employeeName: Employee_Name,
                date: Sales_Date
            }));
        } catch (err) {
            console.error("Error loading sales:", err);
        }
    };
    //save
    const saveSale = async (isEdit: boolean) => {
        if (!saleForm.customerId) {
            messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
            return;
        }
        try {
            if (isEdit) {
                if (!selectedSaleId.value) {
                    messages.edit = "No sale selected.";
                    return;
                }
                await saleService.updateSale(selectedSaleId.value, {
                    customerId: saleForm.customerId,
                });
                (document.getElementById("editSaleModal") as HTMLDialogElement).close();
            } else {

                const resp = await saleService.createSale({
                    customerId: saleForm.customerId,
                });
                (document.getElementById("addSaleModal") as HTMLDialogElement).close();
                loadSale();

                return resp.data.saleId;
            }
        } catch (err) {
            console.error("Error saving sale:", err);
        }
    };
    //delete
    const deleteSale = async () => {
        if (!selectedSaleId.value) {
            messages.delete = "No sale selected.";
            return;
        }
        try {
            await saleService.deleteSale(selectedSaleId.value);
            loadSale();
            (document.getElementById("deleteSaleModal") as HTMLDialogElement).close();
        } catch (err) {
            console.error("Error deleting sale:", err);
        }
    }; 

    onMounted(loadSale);

    return { selectedSaleId, saleSearch, saleDatas, filteredSaleDatas, messages, saleForm, loadSale, saveSale, deleteSale };
}