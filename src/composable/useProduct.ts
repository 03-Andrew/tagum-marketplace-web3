import { computed, ref, reactive, onMounted } from "vue";
import { productService, ProductData} from "../api/product";
import { AxiosError } from "axios";

export function useProduct() {
  const selectedProductId = ref<number>(0);
  const productSearch = ref("");
  const productDatas = ref<ProductData[]>([]);
  const messages = reactive({ edit: "", add: "", delete: "" });
  const initialProductForm = {
    Product_ID: 0,
    Product_Name: "",
    Brand_ID: 0,
    Brand_Name: ""
  }
  const productForm = ref({ ...initialProductForm });

  const resetProductForm = () => {
    productForm.value = { ...initialProductForm };
  }

  const filteredProductDatas = computed(() =>
    productDatas.value.filter(({ Product_Name }) =>
      Product_Name.toLowerCase().includes(productSearch.value.toLowerCase())
    )
  );

  const saveProduct = async (isEdit: boolean) => {
    if (
      !productForm.value.Product_Name ||
      productForm.value.Brand_ID === null
    ) {
      messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
      return;
    }

    try {
      if (isEdit) {
        if (!selectedProductId.value)
          return (messages.edit = "No product selected.");
        await productService.updateProduct(
          selectedProductId.value,
          {
            name: productForm.value.Product_Name,
            brandId: productForm.value.Brand_ID
          }
        );
        (
          document.getElementById("editProductModal") as HTMLDialogElement
        ).close();
      } else {
        await productService.createProduct({
          name: productForm.value.Product_Name,
          brandId: productForm.value.Brand_ID
        });
        (
          document.getElementById("addProductModal") as HTMLDialogElement
        ).close();
      }
      loadProduct();
    } catch (err: AxiosError | any) {
        messages[isEdit ? "edit" : "add"] = err.response.data.message;

    }
  };

  const deleteProduct = async () => {
    if (!selectedProductId.value)
      return (messages.delete = "No product selected.");

    try {
      await productService.deleteProduct(selectedProductId.value);
      (
        document.getElementById("deleteProductModal") as HTMLDialogElement
      ).close();
      loadProduct();
    } catch (err: AxiosError | any) {
        messages.delete = err.response.data.message;

    }
  };

  const loadProduct = async () => {
    try {
      const response = await productService.getProducts();
      productDatas.value = response.data;
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  onMounted(loadProduct);

  return {
    resetProductForm,
    selectedProductId,
    productSearch,
    productDatas,
    messages,
    productForm,
    filteredProductDatas,
    loadProduct,
    saveProduct,
    deleteProduct,
  };
}
