<script setup lang="ts">
import { ref } from "vue";
import { useProductVariant } from "../../../composable/useProductVariant";
import { useProduct } from "../../../composable/useProduct";
import {
  PlusIcon,
  ArrowPathRoundedSquareIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/solid';

const {
  filteredProductVariantDatas,
  saveProductVariant,
  deleteProductVariant,
  productVariantDatas,
  selectedProductVariantId,
  productVariantForm,
  messages,
  productVariantSearch,
  loadProductVariant,
  resetProductVariantForm
} = useProductVariant();

const {
  productDatas,
  loadProduct
} = useProduct();

const validationErrors = ref({
  Bar_Code: "",
  Unit_Weight: "",
  Unit_Size: "",
  Unit_Price: "",
});

const resetValidationErrors = () => {
  validationErrors.value = {
    Bar_Code: "",
    Unit_Weight: "",
    Unit_Size: "",
    Unit_Price: "",
  };
};

const validateForm = () => {
  validationErrors.value = {
    Bar_Code: productVariantForm.value.Bar_Code ? "" : "Bar Code is required.",
    Unit_Weight: productVariantForm.value.Unit_Weight && productVariantForm.value.Unit_Weight > 0 ? "" : "Unit Weight must be valid.",
    Unit_Size: productVariantForm.value.Unit_Size ? "" : "Unit Size is required.",
    Unit_Price: productVariantForm.value.Unit_Price && productVariantForm.value.Unit_Price > 0 ? "" : "Unit Price must be valid.",
  };

  return Object.values(validationErrors.value).every((error) => error === "");
};
const handleSubmit = (isEdit: boolean) => {
  if (validateForm()) {
    saveProductVariant(isEdit);
  }
};
</script>

<template>
  <div class="tg-widget w-[100%]">
    <div class="tg-widget-h">
      <div>
        Product Variants
      </div>
      <div class="flex">
        <label class="input text-[14px] text-black min-w-[270px] h-[32px] mr-2 grow bg-[#f7f2f2]">
          <magnifying-glass-icon class="h-[20px] pr-1 " />
          <input v-model="productVariantSearch" type="search" class="grow" placeholder="Search Product Name or Barcode">
        </label>
        <div @click="loadProductVariant(); loadProduct()" class="tg-widget-btn mr-2 tooltip tooltip-left"
          data-tip="Refresh">
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
        <div @click="
          messages.add = '';
          resetValidationErrors();
        resetProductVariantForm();" onclick="addProductVariantModal.showModal()"
          class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Product Variant">
          <plus-icon class="tg-widget-btn-icon" />
        </div>
      </div>
    </div>
    <div class="tg-table-container">
      <table class="tg-table">
        <thead>
          <tr>
            <td>Product Name</td>
            <td>Barcode</td>
            <td>Unit Weight</td>
            <td>Unit Price</td>
            <td>Inventory Quantity</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="productVariant in filteredProductVariantDatas" :key="productVariant.Product_ID">
            <td>{{ productVariant.Product_Name }}</td>
            <td>{{ productVariant.Bar_Code }}</td>
            <td>{{ Math.round(productVariant.Unit_Weight * 100) / 100 }}{{ productVariant.Unit_Size }}</td>
            <td>₱{{ productVariant.Unit_Price }}</td>
            <td>{{ productVariant.Inventory_Quantity }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px] ">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="editProductVariantModal.showModal()" @click="
                  resetValidationErrors();
                    messages.edit = '';
                  productVariantForm = { ...productVariant };
                  selectedProductVariantId = productVariant.Bar_Code">
                  Edit
                </button>
                <button onclick="deleteProductVariantModal.showModal()" @click="
                resetValidationErrors();
                  messages.delete = '';
                productVariantForm = { ...productVariant };
                selectedProductVariantId = productVariant.Bar_Code"
                  class="btn h-[25px] p-[12px] shadow-md bg-[#fc5861] border-none">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>


  <dialog id="addProductVariantModal" class="modal">
    <div class="modal-box !max-w-fit">
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Add Product Variant Info</p>
      </div>
      <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <div class="flex flex-col">
          <p class="text-xs pb-1">Product:</p>
          <select v-model="productVariantForm.Product_ID" class="rounded-[6px] px-2 py-1 max-w-xs">
            <option v-if="productDatas.length === 0" value="" disabled>No Existing Products</option>
            <option v-else v-for="product in productDatas" :value="product.Product_ID" :key="product.Product_ID">{{
              product.Product_Name }}</option>
          </select>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Barcode:</p>
          <input v-model="productVariantForm.Bar_Code" type="text" placeholder="Barcode"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Bar_Code" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Bar_Code }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Unit Weight:</p>
          <input v-model="productVariantForm.Unit_Weight" type="number" placeholder="Unit Weight"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Bar_Code" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Unit_Weight }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Unit Size: (mg,g,ml,l,etc)</p>
          <input v-model="productVariantForm.Unit_Size" type="text" placeholder="Unit Size"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Bar_Code" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Unit_Size }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Price:</p>
          <input v-model="productVariantForm.Unit_Price" type="number" placeholder="Unit Price"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Bar_Code" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Unit_Price }}
          </p>
        </div>
        <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ messages.add }}</div>
      </fieldset>
      <div class="modal-action">
        <form method="dialog">
          <button class=" btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="handleSubmit(false)" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Create Product Variant</button>
      </div>
    </div>
  </dialog>

  <!--Edit Product Variant Modal-->
  <dialog id="editProductVariantModal" class="modal">
    <div class="modal-box !max-w-fit">
      <div class="leading-none mb-1 flex items-center">
        <p class="text-lg font-bold">Edit Product Variant Info</p>
        <div class="text-[12px] ml-[10px] bg-[#b0594a] text-white badge">
          {{productVariantDatas.find((e) => e.Bar_Code === selectedProductVariantId)?.Bar_Code}}
        </div>
      </div>
      <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <div class="flex flex-col">
          <p class="text-xs pb-1">Product:</p>
          <select v-model="productVariantForm.Product_ID" class="rounded-[6px] px-2 py-1 max-w-xs">
            <option v-if="productDatas.length === 0" value="" disabled>No Existing Products</option>
            <option v-else v-for="product in productDatas" :value="product.Product_ID" :key="product.Product_ID">{{
              product.Product_Name }}</option>
          </select>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Barcode:</p>
          <input v-model="productVariantForm.Bar_Code" type="text" placeholder="Barcode"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Bar_Code" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Bar_Code }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Unit Weight:</p>
          <input v-model="productVariantForm.Unit_Weight" type="number" min="0" placeholder="Unit Weight"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Unit_Weight" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Unit_Weight }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Unit Size: (mg,g,ml,l,etc)</p>
          <input v-model="productVariantForm.Unit_Size" type="text" placeholder="Unit Size"
            class="rounded-[6px] px-2 py-1 max-w-xs" maxlength="3" />
          <p v-if="validationErrors.Unit_Size" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Unit_Size }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Price:</p>
          <input v-model="productVariantForm.Unit_Price" type="number" placeholder="Unit Price"
            class="rounded-[6px] px-2 py-1 max-w-xs" min="0" />
          <p v-if="validationErrors.Unit_Price" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Unit_Price }}
          </p>
        </div>
        <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ messages.edit }}</div>
      </fieldset>
      <div class="modal-action ">
        <form method="dialog">
          <button class="btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="handleSubmit(true)" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Edit Product Variant
        </button>
      </div>
    </div>
  </dialog>

  <!--Delete Product Variant Modal-->
  <dialog id="deleteProductVariantModal" class="modal">
    <div class="modal-box tg-modal p-0 !max-w-fit !min-w-[400px]">
      <div class="border-b-1 border-[#8a544a] mb-2 flex items-center pb-2 m-4">
        <p class="text-[16px] font-bold">Delete Product Variant</p>
      </div>
      <div class="mb-4 pl-6 pt-0 pr-6 flex flex-col">
        <p class="text-[14px] font-medium">Do you really want to delete this product variant?</p>
        <p class="text-[11px]">This action cannot be reversed</p>
        <div class="self-center mt-2 text-xs bg-[#9c2737] text-white w-min h-min m-min px-2 py-1 rounded-[10px]">
          {{ productVariantForm.Bar_Code }}
        </div>
      </div>
      <div class="tg-modal-delete">
        <form method="dialog">
          <button class="mt-1 btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="deleteProductVariant()" class="mt-1 btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Delete
        </button>
      </div>
    </div>
  </dialog>
</template>
