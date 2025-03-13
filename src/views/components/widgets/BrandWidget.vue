<script setup lang="ts">
import { PlusIcon, ArrowPathRoundedSquareIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { ref } from "vue";
import { useBrand } from "../../../composable/useBrand";

const { resetBrandForm, selectedBrandId, brandSearch, brandDatas, filteredBrandDatas, messages, brandForm, loadBrand, saveBrand, deleteBrand }
  = useBrand();

const validationErrors = ref({
  Brand_Name: "",
});

const resetValidationErrors = () => {
  validationErrors.value = {
    Brand_Name: "",
  };
};

const validateBrandForm = () => {
  validationErrors.value = {
    Brand_Name: brandForm.value.Brand_Name ? "" : "Brand Name is required.",
  };

  return Object.values(validationErrors.value).every((error) => error === "");
};

const handleSubmit = (isEdit: boolean) => {
  if (validateBrandForm()) {
    saveBrand(isEdit);
  }
};
</script>

<template>
  <div class="tg-widget">
    <div class="tg-widget-h">
      <div>Brands</div>
      <div class="flex">
        <label class="input text-[14px] text-black h-[32px] mr-2 grow bg-[#f7f2f2]">
          <magnifying-glass-icon class="h-[20px] pr-1" />
          <input v-model="brandSearch" type="search" class="grow" placeholder="Search Brand Name">
        </label>
        <div @click="loadBrand()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
        <div @click="resetBrandForm(); resetValidationErrors();" onclick="addBrandModal.showModal()"
          class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Brand">
          <plus-icon class="tg-widget-btn-icon" />
        </div>
      </div>
    </div>
    <div class="tg-table-container">
      <table class="tg-table">
        <thead>
          <tr>
            <td>Brand Name</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="brand in filteredBrandDatas" :key="brand.Brand_ID">
            <td>{{ brand.Brand_Name }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px] ">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="editBrandModal.showModal()" 
                  @click="selectedBrandId = brand.Brand_ID; brandForm = { ...brand }; resetValidationErrors();">
                  Edit
                </button>
                <button onclick="deleteBrandModal.showModal()"
                  @click="selectedBrandId = brand.Brand_ID; brandForm = { ...brand };"
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

  <dialog id="addBrandModal" class="modal">
  <div class="modal-box !max-w-fit">
    <div class="leading-none mb-1">
      <p class="text-lg font-bold">Add Brand Info</p>
    </div>
    <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
      <div class="flex flex-col">
        <p class="text-xs pb-1">Brand Name:</p>
        <input v-model="brandForm.Brand_Name" type="text" placeholder="Brand Name"
          class="rounded-[6px] px-2 py-1 max-w-xs" />
        <p v-if="validationErrors.Brand_Name" class="text-xs pt-1 !text-[#5e050a]">
          {{ validationErrors.Brand_Name }}
        </p>
      </div>
      <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ messages.add }}</div>
    </fieldset>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
      </form>
      <button @click="handleSubmit(false)" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
        Create Brand
      </button>
    </div>
  </div>
</dialog>

<dialog id="editBrandModal" class="modal">
  <div class="modal-box !max-w-fit">
    <div class="leading-none mb-1 flex items-center">
      <p class="text-lg font-bold">Edit Brand Info</p>
      <div class="text-[12px] ml-[10px] bg-[#b0594a] text-white badge">
        {{ brandDatas.find(({ Brand_ID }) => Brand_ID === selectedBrandId)?.Brand_Name }}
      </div>
    </div>
    <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
      <div class="flex flex-col">
        <p class="text-xs pb-1">Brand Name:</p>
        <input v-model="brandForm.Brand_Name" type="text" placeholder="Brand Name"
          class="rounded-[6px] px-2 py-1 max-w-xs" />
        <p v-if="validationErrors.Brand_Name" class="text-xs pt-1 !text-[#5e050a]">
          {{ validationErrors.Brand_Name }}
        </p>
      </div>
      <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ messages.edit }}</div>
    </fieldset>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
      </form>
      <button @click="handleSubmit(true)" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
        Save Info
      </button>
    </div>
  </div>
</dialog>

<dialog id="deleteBrandModal" class="modal">
  <div class="modal-box tg-modal p-0 !max-w-fit !min-w-[400px]">
    <div class="border-b-1 border-[#8a544a] mb-2 flex items-center pb-2 m-4">
      <p class="text-[16px] font-bold">Delete Brand</p>
    </div>
    <div class="mb-4 pl-6 pt-0 pr-6 flex flex-col">
      <p class="text-[14px] font-medium">Do you really want to delete this brand?</p>
      <p class="text-[11px]">This action cannot be reversed</p>
      <div class="self-center mt-2 text-xs bg-[#9c2737] text-white w-min h-min m-min px-2 py-1 rounded-[10px]">
        {{ brandForm.Brand_Name }}
      </div>
    </div>
    <div class="tg-modal-delete">
      <form method="dialog">
        <button class="mt-1 btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
      </form>
      <button @click="deleteBrand()" class="mt-1 btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
        Delete
      </button>
    </div>
  </div>
</dialog>
</template>
