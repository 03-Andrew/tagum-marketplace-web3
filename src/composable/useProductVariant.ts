import { computed, ref, reactive, onMounted } from "vue";
import {
  ProductVariantData,
  productVariantService,
} from "../api/productVariant";
import { AxiosError } from "axios";
export function useProductVariant() {
  const selectedProductVariantId = ref<string | null>(null);
  const productVariantSearch = ref("");
  const productVariantDatas = ref<ProductVariantData[]>([]);
  const messages = reactive({ edit: "", add: "", delete: "" });
  const initialProductVariantForm = {
    Product_Name: "",
    Bar_Code: "",
    Product_ID: 0,
    Unit_Weight: 0,
    Unit_Size: "",
    Unit_Price: 0
  }
  const productVariantForm = ref({ ...initialProductVariantForm });
  const resetProductVariantForm = () => {
    productVariantForm.value = { ...initialProductVariantForm };
  }
  const filteredProductVariantDatas = computed(() =>
    productVariantDatas.value.filter(
      (e) =>
        e.Product_Name.toLowerCase().includes(
          productVariantSearch.value.toLowerCase()
        ) ||
        e.Bar_Code.toLowerCase().includes(
          productVariantSearch.value.toLowerCase()
        )
    )
  );
  //Load
  const loadProductVariant = async () => {
    try {
      const response = await productVariantService.getProductVariants();
      productVariantDatas.value = response.data;
    } catch (err) {
      console.error("Error loading product variants:", err);
    }
  };

  //Save
  const saveProductVariant = async (isEdit: boolean) => {
    if (!productVariantForm.value.Bar_Code || productVariantForm.value.Product_ID === null || 
      productVariantForm.value.Product_ID ===0
      || !productVariantForm.value.Unit_Weight || !productVariantForm.value.Unit_Size 
      || !productVariantForm.value.Unit_Price) {
      messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
      return;
    }
    const { Bar_Code, Product_ID, Unit_Weight, Unit_Size, Unit_Price } = productVariantForm.value;
    try {
      if (isEdit) {
        if(!selectedProductVariantId.value) return (messages.edit = "No product variant selected.");

        await productVariantService.updateProductVariant(selectedProductVariantId.value, 
            {
             newBarCode: Bar_Code,
             productId: Product_ID,
             unitWeight: Unit_Weight,
             unitSize: Unit_Size,
             unitPrice: Unit_Price 
            });
        (document.getElementById("editProductVariantModal") as HTMLDialogElement).close();
      } else {
        await productVariantService.createProductVariant(
            { 
                newBarCode: Bar_Code, 
                productId: Product_ID, 
                unitWeight: Unit_Weight, 
                unitSize: Unit_Size, 
                unitPrice: Unit_Price 
            });
        (document.getElementById("addProductVariantModal") as HTMLDialogElement).close();
      }
      loadProductVariant();
    } catch (err: AxiosError | any) {
        messages[isEdit ? "edit" : "add"] = err.response.data.message;
    }
  };
  //Delete
  const deleteProductVariant = async () => {
    if (!selectedProductVariantId.value) return (messages.delete = "No product variant selected.");
  
    try {
      await productVariantService.deleteProductVariant(selectedProductVariantId.value);
      (document.getElementById("deleteProductVariantModal") as HTMLDialogElement).close();
      loadProductVariant();
    } catch (err: AxiosError | any) {
        messages.delete = err.response.data.message;
    }
  };

  onMounted(loadProductVariant);
  return {
    resetProductVariantForm,
    productVariantDatas,
    filteredProductVariantDatas,
    loadProductVariant,
    saveProductVariant,
    deleteProductVariant,
    selectedProductVariantId,
    productVariantForm,
    messages,
    productVariantSearch
  };
}
