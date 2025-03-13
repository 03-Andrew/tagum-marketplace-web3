import { computed, ref, reactive, onMounted } from "vue";
import { SupplyDetailData, supplyDetailService } from "../api/supplyDetail";

export function useSupplyDetail() {
  const selectedSupplyDetailId = ref<number | null>(null);
  const supplyDetailSearch = ref({
    Supply_ID: 0
  }
  );
  const supplyDetailDatas = ref<SupplyDetailData[]>([]);
  const messages = reactive({ edit: "", add: "", delete: "" });
  const initialSupplyDetailForm = {
    SupplyDetail_ID: 0,
    Supply_ID: 0,
    Quantity: 0,
    Bar_Code: "",
    Unit_Price: 0,
    Expiry: new Date(),
    Subtotal: 0,
}

  const resetSupplyDetailForm = () => {
    supplyDetailForm.value = { ...initialSupplyDetailForm };
  }
  const supplyDetailForm = ref({ ...initialSupplyDetailForm });

  const filteredSupplyDetailDatas = computed(() =>
    supplyDetailDatas.value.filter(({ Supply_ID }) =>
      Supply_ID.toString().includes(supplyDetailSearch.value.Supply_ID.toString().toLowerCase())
    )
  );

  //Load
  const loadSupplyDetail = async () => {
    try {
      const response = await supplyDetailService.getSupplyDetails();
      supplyDetailDatas.value = response.data;
    } catch (err) {
      console.error("Error loading supply details:", err);
    }
  };
  //Save
  const saveSupplyDetail = async (isEdit: boolean) => {
    if (
      !supplyDetailForm.value.Bar_Code ||
      !supplyDetailForm.value.Quantity ||
      !supplyDetailForm.value.Unit_Price ||
      !supplyDetailForm.value.Expiry
    ) {
      messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
      return;
    }
    try {
      if (isEdit) {
        if(!selectedSupplyDetailId.value){
          messages.edit = "No supply detail selected.";
          return
        }
        await supplyDetailService.updateSupplyDetail(
          selectedSupplyDetailId.value,
          {
            quantity: supplyDetailForm.value.Quantity,
            unitPrice: supplyDetailForm.value.Unit_Price,
            expiry: supplyDetailForm.value.Expiry.toISOString(),
          }
        );
        (
          document.getElementById("editSupplyDetailModal") as HTMLDialogElement
        ).close();
      } else {
        await supplyDetailService.createSupplyDetail({
          supplyId: supplyDetailForm.value.Supply_ID,
          barCode: supplyDetailForm.value.Bar_Code,
          quantity: supplyDetailForm.value.Quantity,
          unitPrice: supplyDetailForm.value.Unit_Price,
          expiry: new Date(supplyDetailForm.value.Expiry).toISOString(),
        });
      }
      messages[isEdit ? "edit" : "add"] = "";
      resetSupplyDetailForm();
      loadSupplyDetail();
    } catch (err) {
      console.error("Error saving supply detail:", err);
      messages.edit = "Error saving supply detail.";
    }
  };
  //Delete
  const deleteSupplyDetail = async () => {
    if (!selectedSupplyDetailId.value){
      return (messages.delete = "No supply detail selected.");
    }
    try {
      await supplyDetailService.deleteSupplyDetail(
        selectedSupplyDetailId.value
      );
      messages.delete = "Supply detail deleted successfully.";
      (document.getElementById("deleteSupplyDetailModal") as HTMLDialogElement).close();

      loadSupplyDetail();
    } catch (err) {
      console.error("Error deleting supply detail:", err);
      messages.delete = "Error deleting supply detail.";
    }
  };

  onMounted(loadSupplyDetail);

  return {
    resetSupplyDetailForm,
    loadSupplyDetail,
    selectedSupplyDetailId,
    supplyDetailSearch,
    supplyDetailDatas,
    messages,
    supplyDetailForm,
    filteredSupplyDetailDatas,
    saveSupplyDetail,
    deleteSupplyDetail,
  };
}
