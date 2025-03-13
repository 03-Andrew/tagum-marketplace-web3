import { computed, ref, reactive, onMounted } from "vue";
import { SupplierData, supplierService } from "../api/supplier";
import axios from "axios";

export function useSupplier() {
  const selectedSupplierId = ref<number>(0);
  const supplierSearch = ref("");
  const supplierDatas = ref<SupplierData[]>([]);
  const messages = reactive({ edit: "", add: "", delete: "" });
  const initialSupplierForm = {
    Supplier_ID: 0,
    Supplier_Name: "",
    Supplier_Email: "",
    Supplier_Address: "",
    Supplier_ContactNo: "",
  }
  const supplierForm = ref({ ...initialSupplierForm });

  const resetSupplierForm = () => {
    supplierForm.value = { ...initialSupplierForm };
  };

  const filteredSupplierDatas = computed(() =>
    supplierDatas.value.filter(({ Supplier_Name }) =>
      Supplier_Name.toLowerCase().includes(supplierSearch.value.toLowerCase())
    )
  );

  const saveSupplier = async (isEdit: boolean) => {
    if (
      !supplierForm.value.Supplier_Name ||
      !supplierForm.value.Supplier_Address ||
      !supplierForm.value.Supplier_Email ||
      !supplierForm.value.Supplier_ContactNo
    ) {
      messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
      return;
    }

    try {
      if (isEdit) {
        if (!selectedSupplierId.value)
          return (messages.edit = "No supplier selected.");
        await supplierService.updateSupplier(
          selectedSupplierId.value,
          {
            name: supplierForm.value.Supplier_Name,
            email: supplierForm.value.Supplier_Email,
            address: supplierForm.value.Supplier_Address,
            contactno: supplierForm.value.Supplier_ContactNo
          }
        );
        (
          document.getElementById("editSupplierModal") as HTMLDialogElement
        ).close();
      } else {
        await supplierService.createSupplier({
          name: supplierForm.value.Supplier_Name,
          email: supplierForm.value.Supplier_Email,
          address: supplierForm.value.Supplier_Address,
          contactno: supplierForm.value.Supplier_ContactNo
        });
        (
          document.getElementById("addSupplierModal") as HTMLDialogElement
        ).close();
      }
      loadSupplier();
    } catch (err) {
      messages[isEdit ? "edit" : "add"] = axios.isAxiosError(err)
        ? err.response?.data?.message || "Server error"
        : "Unexpected error.";
    }
  };

  const deleteSupplier = async () => {
    if (!selectedSupplierId.value)
      return (messages.delete = "No supplier selected.");

    try {
      await supplierService.deleteSupplier(selectedSupplierId.value);
      (
        document.getElementById("deleteSupplierModal") as HTMLDialogElement
      ).close();
      loadSupplier();
    } catch (err) {
      messages.delete = axios.isAxiosError(err)
        ? err.response?.data?.message || "Server error"
        : "Unexpected error.";
    }
  };

  const loadSupplier = async () => {
    try {
      const response = await supplierService.getSuppliers();
      supplierDatas.value = response.data;
    } catch (err) {
      console.error("Error loading suppliers:", err);
    }
  };

  onMounted(loadSupplier);

  return {
    resetSupplierForm,
    supplierDatas,
    supplierSearch,
    filteredSupplierDatas,
    selectedSupplierId,
    supplierForm,
    messages,
    loadSupplier,
    saveSupplier,
    deleteSupplier,
  };
}
