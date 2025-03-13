import { computed, ref, reactive, onMounted } from "vue";
import { SaleDetailCreate, SaleDetailData, saleDetailService } from "../api/saleDetail";

export function useSaleDetail() {
    const selectedSaleDetailId = ref<number | null>(null);
    const saleDetailSearch = ref(0);
    const saleDetailDatas = ref<SaleDetailData[]>([]);
    const messages = reactive({ edit: "", add: "", delete: "" });
    
    const filteredSaleDetailDatas = computed(() =>
      saleDetailDatas.value.filter(({ saleId }) =>
        saleId.toString().includes(saleDetailSearch.value.toString().toLowerCase())
      )
    );

    const initialSaleDetailForm = {
        saleId: 0,
        barCode: "",
        unitPrice: 0,
        quantity: 1,
        subTotal: 0,
    };

    const saleDetailForm = ref({ ...initialSaleDetailForm });

    const resetSaleDetailForm = () => {
        saleDetailForm.value = { ...initialSaleDetailForm };
    }
    const loadSaleDetail = async () => {
        try {
            const response = await saleDetailService.getSaleDetails();
            saleDetailDatas.value = response.data.map((row: any) => ({
                saleId: row.Sales_ID,
                barCode: row.Bar_Code,
                unitPrice: parseFloat(row.Unit_Price),
                quantity: row.Quantity,
                subTotal: parseFloat(row.Subtotal),
            }));
        } catch (err) {
            console.error("Error loading sale details:", err);
        }
    };
    //Add
    const addSaveDetails = async (
        saleId: number,
        saleDetails: SaleDetailCreate[]
      ) => {
        if (saleDetails.length > 0) {
          try {
            if (!saleId) {
              messages.edit = "No sale id selected.";
              return;
            }
            await saleDetailService.createSaleDetail(
              saleId,
              saleDetails
            );
            loadSaleDetail();
          } catch (err) {
            messages.edit = "Error saving sale detail.";
          }
        } else {
          messages.add = "Please enter at least one sale detail.";
        }
    };
   
    //delete
    const deleteSaleDetail = async (barCode: string, saleId: number) => {
        if (!barCode || !saleId) {
            messages["delete"] = "Select a sale detail to delete.";
            return;
        }
        try {
            await saleDetailService.deleteSaleDetail(saleId, barCode);
            loadSaleDetail();
        } catch (err) {
            messages.delete = "Error deleting sale detail.";
        }
    };
    onMounted(loadSaleDetail);
    return { addSaveDetails, resetSaleDetailForm,selectedSaleDetailId, saleDetailSearch, saleDetailDatas, filteredSaleDetailDatas, messages, saleDetailForm, loadSaleDetail, deleteSaleDetail };
}