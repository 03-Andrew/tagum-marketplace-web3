<script setup lang="ts">
import { PlusIcon, ArrowPathRoundedSquareIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { ref } from "vue";
import { useSupplier } from '../../../composable/useSupplier';

const {
  resetSupplierForm,
  selectedSupplierId,
  supplierSearch,
  supplierDatas,
  filteredSupplierDatas,
  messages,
  supplierForm,
  loadSupplier,
  saveSupplier,
  deleteSupplier,
} = useSupplier();


const validationErrors = ref({
  Supplier_Name: "",
  Supplier_Address: "",
  Supplier_Email: "",
  Supplier_ContactNo: "",
});

const resetValidationErrors = () => {
  validationErrors.value = {
    Supplier_Name: "",
    Supplier_Address: "",
    Supplier_Email: "",
    Supplier_ContactNo: "",
  };
};

const validateSupplierForm = () => {
  validationErrors.value = {
    Supplier_Name: supplierForm.value.Supplier_Name ? "" : "Supplier Name is required.",
    Supplier_Address: supplierForm.value.Supplier_Address ? "" : "Address is required.",
    Supplier_Email: supplierForm.value.Supplier_Email ? "" : "Email Address is required.",
    Supplier_ContactNo: supplierForm.value.Supplier_ContactNo ? "" : "Contact Number is required.",
  };

  return Object.values(validationErrors.value).every((error) => error === "");
};

const handleSubmit = (isEdit: boolean) => {
  if (validateSupplierForm()) {
    saveSupplier(isEdit);
  }
};
</script>

<template>
  <div class="tg-widget">
    <div class="tg-widget-h">
      <div>Suppliers</div>
      <div class="flex">
        <label class="input text-[14px] text-black h-[32px] mr-2 grow bg-[#f7f2f2]">
          <magnifying-glass-icon class="h-[20px] pr-1" />
          <input v-model="supplierSearch" type="search" class="grow" placeholder="Search Supplier Name">
        </label>
        <div @click="loadSupplier()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
        <div @click="resetSupplierForm(); resetValidationErrors();" onclick="addSupplierModal.showModal()"
          class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Supplier">
          <plus-icon class="tg-widget-btn-icon" />
        </div>
      </div>
    </div>
    <div class="tg-table-container">
      <table class="tg-table">
        <thead>
          <tr>
            <td>Supplier</td>
            <td>Address</td>
            <td>Email Address</td>
            <td>Contact No</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supplier in filteredSupplierDatas" :key="supplier.Supplier_ID">
            <td>{{ supplier.Supplier_Name }}</td>
            <td>{{ supplier.Supplier_Address }}</td>
            <td>{{ supplier.Supplier_Email }}</td>
            <td>{{ supplier.Supplier_ContactNo }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px]">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="editSupplierModal.showModal()" @click="
                  messages.edit = '';
                  selectedSupplierId = supplier.Supplier_ID;
                  supplierForm = { ...supplier };
                  resetValidationErrors();
                ">
                  Edit
                </button>
                <button onclick="deleteSupplierModal.showModal()" @click="
                  messages.delete = '';
                  selectedSupplierId = supplier.Supplier_ID;
                  supplierForm = { ...supplier };
                " class="btn h-[25px] p-[12px] shadow-md bg-[#fc5861] border-none">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Add Supplier Modal -->
  <dialog id="addSupplierModal" class="modal">
    <div class="modal-box !max-w-fit">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Add Supplier Info</p>
      </div>
      <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <div class="flex flex-col">
          <p class="text-xs pb-1">Supplier Name:</p>
          <input v-model="supplierForm.Supplier_Name" type="text" placeholder="Supplier Name"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Supplier_Name" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Supplier_Name }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Address:</p>
          <input v-model="supplierForm.Supplier_Address" type="text" placeholder="Address"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Supplier_Address" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Supplier_Address }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Email Address:</p>
          <input v-model="supplierForm.Supplier_Email" type="text" placeholder="Email Address"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Supplier_Email" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Supplier_Email }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Contact No:</p>
          <input v-model="supplierForm.Supplier_ContactNo" type="text" placeholder="Contact No."
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Supplier_ContactNo" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Supplier_ContactNo }}
          </p>
        </div>
        <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ messages.add }}</div>
      </fieldset>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="handleSubmit(false)" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Create Supplier
        </button>
      </div>
    </div>
  </dialog>

  <!-- Edit Supplier Modal -->
  <dialog id="editSupplierModal" class="modal">
    <div class="modal-box !max-w-fit">
      <div class="leading-none mb-1 flex items-center">
        <p class="text-lg font-bold">Edit Supplier Info</p>
        <div class="text-[12px] ml-[10px] bg-[#b0594a] text-white badge">
          {{ supplierDatas.find(({ Supplier_ID }) => Supplier_ID === selectedSupplierId)?.Supplier_Name }}
        </div>
      </div>
      <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <div class="flex flex-col">
          <p class="text-xs pb-1">Supplier Name:</p>
          <input v-model="supplierForm.Supplier_Name" type="text" placeholder="Supplier Name"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Supplier_Name" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Supplier_Name }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Address:</p>
          <input v-model="supplierForm.Supplier_Address" type="text" placeholder="Address"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Supplier_Address" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Supplier_Address }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Email Address:</p>
          <input v-model="supplierForm.Supplier_Email" type="text" placeholder="Email Address"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Supplier_Email" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Supplier_Email }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Contact No:</p>
          <input v-model="supplierForm.Supplier_ContactNo" type="text" placeholder="Contact No."
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Supplier_ContactNo" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Supplier_ContactNo }}
          </p>
        </div>
        <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ messages.edit }}</div>
      </fieldset>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="handleSubmit(true)" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Edit Supplier
        </button>
      </div>
    </div>
  </dialog>

  <!-- Delete Supplier Modal -->
  <dialog id="deleteSupplierModal" class="modal">
    <div class="modal-box tg-modal p-0 !max-w-fit !min-w-[400px]">
      <div class="border-b-1 border-[#8a544a] mb-2 flex items-center pb-2 m-4">
        <p class="text-[16px] font-bold">Delete Supplier</p>
      </div>
      <div class="mb-4 pl-6 pt-0 pr-6 flex flex-col">
        <p class="text-[14px] font-medium">Do you really want to delete this supplier?</p>
        <p class="text-[11px]">This action cannot be reversed</p>
        <div class="self-center mt-2 text-xs bg-[#9c2737] text-white w-min h-min m-min px-2 py-1 rounded-[10px]">
          {{ supplierForm.Supplier_Name }}
        </div>
      </div>
      <div class="tg-modal-delete">
        <form method="dialog">
          <button class="mt-1 btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="deleteSupplier()" class="mt-1 btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Delete
        </button>
      </div>
    </div>
  </dialog>
</template>