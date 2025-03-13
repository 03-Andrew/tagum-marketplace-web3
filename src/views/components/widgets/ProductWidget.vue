<script setup lang="ts">
import { useProduct } from "../../../composable/useProduct";
import { useBrand } from "../../../composable/useBrand";
import {
  PlusIcon,
  ArrowPathRoundedSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/solid";
import { ref } from "vue";

const {
  selectedProductId,
  productSearch,
  messages,
  productForm,
  filteredProductDatas,
  loadProduct,
  saveProduct,
  deleteProduct,
  productDatas,
  resetProductForm
} = useProduct();

const {
  brandDatas
} = useBrand();

const validationErrors = ref({
    Product_Name: "",
    Brand_ID: "",
});

const resetValidationErrors = () => {
    validationErrors.value = {
        Product_Name: "",
        Brand_ID: "",
    };
};

const validateProductForm = () => {
    validationErrors.value = {
        Product_Name: productForm.value.Product_Name ? "" : "Product Name is required.",
        Brand_ID: productForm.value.Brand_ID ? "" : "Brand is required.",
    };

    return Object.values(validationErrors.value).every((error) => error === "");
};

const handleSubmit = (isEdit: boolean) => {
    if (validateProductForm()) {
        saveProduct(isEdit);
    }
};

</script>

<template>
  <div class="tg-widget">
    <div class="tg-widget-h">
      <div>Products</div>
      <div class="flex">
        <label
          class="input text-[14px] text-black h-[32px] mr-2 grow bg-[#f7f2f2]"
        >
          <magnifying-glass-icon class="h-[20px] pr-1" />
          <input
            v-model="productSearch"
            type="search"
            class="grow"
            placeholder="Search Product Name"
          />
        </label>
        <div
          @click="loadProduct()"
          class="tg-widget-btn mr-2 tooltip tooltip-left"
          data-tip="Refresh"
        >
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
        <div
          @click="resetProductForm(); resetValidationErrors();"
          onclick="addProductModal.showModal()"
          class="tg-widget-btn mr-2 tooltip tooltip-left"
          data-tip="Add New Product"
        >
          <plus-icon class="tg-widget-btn-icon" />
        </div>
      </div>
    </div>
    <div class="tg-table-container">
      <table class="tg-table">
        <thead>
          <tr>
            <td>Product Name</td>
            <td>Brand</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProductDatas" :key="product.Product_ID">
            <td>{{ product.Product_Name }}</td>
            <td>{{ product.Brand_Name }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px]">
                <button
                  class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="editProductModal.showModal()"
                  @click="
                    productForm = {...product};
                    selectedProductId = product.Product_ID;
                    resetValidationErrors();
                  "
                >
                  Edit
                </button>
                <button
                  onclick="deleteProductModal.showModal()"
                  @click="
                    productForm = {...product};
                    selectedProductId = product.Product_ID;
                  "
                  class="btn h-[25px] p-[12px] shadow-md bg-[#fc5861] border-none"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <dialog id="addProductModal" class="modal">
    <div class="modal-box !max-w-fit">
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Add Product Info</p>
      </div>
      <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <div class="flex flex-col">
          <p class="text-xs pb-1">Product Name:</p>
          <input
            v-model="productForm.Product_Name"
            type="text"
            placeholder="Product Name"
            class="rounded-[6px] px-2 py-1 max-w-xs"
          />
          <p v-if="validationErrors.Product_Name" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Product_Name }}
          </p>
        </div>
        <div class="flex flex-col pt-2">
          <p class="text-xs pb-1">Brand:</p>
          <select
            v-model="productForm.Brand_ID"
            class="rounded-[6px] px-2 py-1 max-w-xs"
          >
            <option value="" disabled selected>Select Brand</option>
            <option v-for="brand in brandDatas" :value="brand.Brand_ID" :key="brand.Brand_ID">
              {{ brand.Brand_Name }}
            </option>
          </select>
          <p v-if="validationErrors.Brand_ID" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Brand_ID }}
          </p>
        </div>
        <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ messages.add }}</div>
      </fieldset>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button
          @click="handleSubmit(false)"
          class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]"
        >
          Add Product
        </button>
      </div>
    </div>
  </dialog>

  <dialog id="editProductModal" class="modal">
    <div class="modal-box !max-w-fit">
      <div class="leading-none mb-1 flex items-center">
        <p class="text-lg font-bold">Edit Product Info</p>
        <div class="text-[12px] ml-[10px] bg-[#b0594a] text-white badge">
          {{ productDatas.find(product => product.Product_ID === selectedProductId)?.Product_Name }}
        </div>
      </div>
      <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <div class="flex flex-col">
          <p class="text-xs pb-1">Product Name:</p>
          <input
            v-model="productForm.Product_Name"
            type="text"
            placeholder="Product Name"
            class="rounded-[6px] px-2 py-1 max-w-xs"
          />
          <p v-if="validationErrors.Product_Name" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Product_Name }}
          </p>
        </div>
        <div class="flex flex-col pt-2">
          <p class="text-xs pb-1">Brand:</p>
          <select
            v-model="productForm.Brand_ID"
            class="rounded-[6px] px-2 py-1 max-w-xs"
          >
            <option value="" disabled selected>Select Brand</option>
            <option v-for="brand in brandDatas" :value="brand.Brand_ID" :key="brand.Brand_ID">
              {{ brand.Brand_Name }}
            </option>
          </select>
          <p v-if="validationErrors.Brand_ID" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Brand_ID }}
          </p>
        </div>
        <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ messages.edit }}</div>
      </fieldset>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button
          @click="handleSubmit(true)"
          class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]"
        >
          Edit Product Info
        </button>
      </div>
    </div>
  </dialog>

  <dialog id="deleteProductModal" class="modal">
    <div class="modal-box tg-modal p-0 !max-w-fit !min-w-[400px]">
      <div class="border-b-1 border-[#8a544a] mb-2 flex items-center pb-2 m-4">
        <p class="text-[16px] font-bold">Delete Product</p>
      </div>
      <div class="mb-4 pl-6 pt-0 pr-6 flex flex-col">
        <p class="text-[14px] font-medium">Do you really want to delete this product?</p>
        <p class="text-[11px]">This action cannot be reversed</p>
        <div class="self-center mt-2 text-xs bg-[#9c2737] text-white w-min h-min m-min px-2 py-1 rounded-[10px]">
          {{ productForm.Product_Name }}
        </div>
      </div>
      <div class="tg-modal-delete">
        <form method="dialog">
          <button class="mt-1 btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button
          @click="deleteProduct()"
          class="mt-1 btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]"
        >
          Delete
        </button>
      </div>
    </div>
  </dialog>
</template>