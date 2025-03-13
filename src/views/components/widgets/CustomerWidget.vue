<script setup lang="ts">
import { PlusIcon, ArrowPathRoundedSquareIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { ref } from "vue";
import { useCustomer } from "../../../composable/useCustomer";

const {
  resetCustomerForm,
  selectedCustomerId,
  customerSearch,
  customerDatas,
  filteredCustomerDatas,
  messages,
  customerForm,
  loadCustomer,
  saveCustomer,
  deleteCustomer,
} = useCustomer();


const validationErrors = ref({
  name: "",
  phone: "",
  address: "",
});

const resetValidationErrors = () => {
  validationErrors.value = {
    name: "",
    phone: "",
    address: "",
  };
};

const validateCustomerForm = () => {
  validationErrors.value = {
    name: customerForm.value.name ? "" : "Customer Name is required.",
    phone: customerForm.value.phone ? "" : "Contact Number is required.",
    address: customerForm.value.address ? "" : "Address is required.",
  };

  return Object.values(validationErrors.value).every((error) => error === "");
};

const handleSubmit = (isEdit: boolean) => {
  if (validateCustomerForm()) {
    saveCustomer(isEdit);
  }
};
</script>

<template>
  <div class="tg-widget">
    <div class="tg-widget-h">
      <div>Customers</div>
      <div class="flex">
        <label class="input text-[14px] text-black h-[32px] mr-2 grow bg-[#f7f2f2]">
          <magnifying-glass-icon class="h-[20px] pr-1" />
          <input v-model="customerSearch" type="search" class="grow" placeholder="Search Customer Name">
        </label>
        <div @click="loadCustomer()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
        <div @click="resetCustomerForm(); resetValidationErrors();" onclick="addCustomerModal.showModal()"
          class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Customer">
          <plus-icon class="tg-widget-btn-icon" />
        </div>
      </div>
    </div>
    <div class="tg-table-container">
      <table class="tg-table">
        <thead>
          <tr>
            <td>Customer Name</td>
            <td>Contact Number</td>
            <td>Address</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomerDatas" :key="customer.id">
            <td>{{ customer.name }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.address }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px]">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="editCustomerModal.showModal()"
                  @click="selectedCustomerId = customer.id; customerForm = { ...customer }; resetValidationErrors();">
                  Edit
                </button>
                <button onclick="deleteCustomerModal.showModal()"
                  @click="selectedCustomerId = customer.id; customerForm = { ...customer };"
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

  <!-- Add Customer Modal -->
  <dialog id="addCustomerModal" class="modal">
    <div class="modal-box !max-w-fit">
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Add Customer Info</p>
      </div>
      <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <div class="flex flex-col">
          <p class="text-xs pb-1">Customer Name:</p>
          <input v-model="customerForm.name" type="text" placeholder="Customer Name"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.name" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.name }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Contact Number:</p>
          <input v-model="customerForm.phone" type="text" placeholder="Contact Number"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.phone" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.phone }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Address:</p>
          <input v-model="customerForm.address" type="text" placeholder="Address"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.address" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.address }}
          </p>
        </div>
        <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ messages.add }}</div>
      </fieldset>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="handleSubmit(false)" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Create Customer
        </button>
      </div>
    </div>
  </dialog>

  <!-- Edit Customer Modal -->
  <dialog id="editCustomerModal" class="modal">
    <div class="modal-box !max-w-fit">
      <div class="leading-none mb-1 flex items-center">
        <p class="text-lg font-bold">Edit Customer Info</p>
        <div class="text-[12px] ml-[10px] bg-[#b0594a] text-white badge">
          {{ customerDatas.find((c) => c.id === selectedCustomerId)?.name }}
        </div>
      </div>
      <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <div class="flex flex-col">
          <p class="text-xs pb-1">Customer Name:</p>
          <input v-model="customerForm.name" type="text" placeholder="Customer Name"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.name" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.name }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Contact Number:</p>
          <input v-model="customerForm.phone" type="text" placeholder="Contact Number"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.phone" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.phone }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Address:</p>
          <input v-model="customerForm.address" type="text" placeholder="Address"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.address" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.address }}
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

  <!-- Delete Customer Modal -->
  <dialog id="deleteCustomerModal" class="modal">
    <div class="modal-box tg-modal p-0 !max-w-fit !min-w-[400px]">
      <div class="border-b-1 border-[#8a544a] mb-2 flex items-center pb-2 m-4">
        <p class="text-[16px] font-bold">Delete Customer</p>
      </div>
      <div class="mb-4 pl-6 pt-0 pr-6 flex flex-col">
        <p class="text-[14px] font-medium">Do you really want to delete this customer?</p>
        <p class="text-[11px]">This action cannot be reversed</p>
        <div class="self-center mt-2 text-xs bg-[#9c2737] text-white w-min h-min m-min px-2 py-1 rounded-[10px]">
          {{ customerForm.name }}
        </div>
      </div>
      <div class="tg-modal-delete">
        <form method="dialog">
          <button class="mt-1 btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="deleteCustomer()" class="mt-1 btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Delete
        </button>
      </div>
    </div>
  </dialog>
</template>