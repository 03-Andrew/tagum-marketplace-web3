<script setup lang="ts">
import { PlusIcon, ArrowPathRoundedSquareIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { ref } from "vue";
import { useProductVariant } from "../../../composable/useProductVariant";
import { useSupply } from "../../../composable/useSupply";
import { useSupplyDetail } from "../../../composable/useSupplyDetail";
import { useSupplier } from "../../../composable/useSupplier";
import { useRemark } from "../../../composable/useRemark";
import { useStockOutSupply } from "../../../composable/useStockOutSupply";

const {
  supplierDatas,
  loadSupplier,
} = useSupplier();

const {
  productVariantSearch,
  filteredProductVariantDatas,
  loadProductVariant,
} = useProductVariant();

const {
  resetSupplyForm,
  filteredSupplyDatas,
  supplySearch,
  selectedSupplyId,
  messages: supplyMessages,
  deleteSupply,
  supplyForm,
  saveSupply,
  loadSupply,
} = useSupply();

const {
  supplyDetailSearch,
  selectedSupplyDetailId,
  filteredSupplyDetailDatas,
  loadSupplyDetail,
  deleteSupplyDetail,
  saveSupplyDetail,
  supplyDetailForm,
} = useSupplyDetail();

const {
  saveStockOutSupply,
  messages: stockOutSupplyMessages,
  stockOutSupplies,
  loadStockOutSupplies,
  stockOutSupplyForm,
} = useStockOutSupply();

const {
  remarkDatas,
} = useRemark();

const reloadData = () => {
  loadProductVariant();
  loadSupplier();
  loadSupply();
  loadStockOutSupplies();
  loadSupplyDetail();
};

const getStockOutRemark = (id: number) => {
  const stockOut = stockOutSupplies.value.find(stockOut => stockOut.SupplyDetail_ID === id);
  if (!stockOut) return "Active";
  return remarkDatas.value.find(remark => remark.Remarks_ID === stockOut.Remarks_ID)?.Remarks;
};

const validationSupplyErrors = ref({
  Supplier_id: "",
  Supply_date: "",
})
const validationSupplyDetailErrors = ref({
  Supply_ID: "",
  Bar_Code: "",
  Quantity: "",
  Unit_Price: "",
  Expiry: "",
});

const resetValidationSupplyErrors = () => {
  validationSupplyErrors.value = {
    Supplier_id: "",
    Supply_date: "",
  };
};
const resetValidationSupplyDetailErrors = () => {
  validationSupplyDetailErrors.value = {
    Supply_ID: "",
    Bar_Code: "",
    Quantity: "",
    Unit_Price: "",
    Expiry: "",
  };
};

const validateSupplyForm = () => {
  validationSupplyErrors.value = {
    Supplier_id: supplyForm.value.Supplier_id ? "" : "Supplier is required.",
    Supply_date: supplyForm.value.Supply_date ? "" : "Supply Date is required.",
  };
  return Object.values(validationSupplyErrors.value).every((error) => error === "");
};
const validateSupplyDetailForm = () => {
  validationSupplyDetailErrors.value = {
    Supply_ID: supplyDetailForm.value.Supply_ID ? "" : "Supply is required.",
    Bar_Code: supplyDetailForm.value.Bar_Code ? "" : "Product is required.",
    Quantity: Number.isInteger(supplyDetailForm.value.Quantity) && supplyDetailForm.value.Quantity > 0 ? "" : "Quantity must be greater than 0.",
    Unit_Price: Number.isInteger(supplyDetailForm.value.Unit_Price) && supplyDetailForm.value.Unit_Price > 0 ? "" : "Unit Price must be greater than 0.",
    Expiry: supplyDetailForm.value.Expiry ? "" : "Expiry Date is required.",
  };
  return Object.values(validationSupplyDetailErrors.value).every((error) => error === "");
}
const handleSubmit = (isEdit: boolean) => {
  if (validateSupplyForm()) {
    console.log(1)
    if (isEdit) {
      saveSupply(true);
    } else {
      saveSupply(false);
    }
  }
};

const handleSubmitDetail = () => {
  if (validateSupplyDetailForm()) {
    saveSupplyDetail(false);
  }
};
</script>

<template>
  <div class="tg-widget">
    <div class="tg-widget-h">
      <div>Supplies</div>
      <div class="flex">
        <label class="input text-[14px] text-black h-[32px] mr-2 grow bg-[#f7f2f2]">
          <magnifying-glass-icon class="h-[20px] pr-1" />
          <input v-model="supplySearch.name" type="search" class="grow" placeholder="Search Supplier Name">
        </label>
        <div @click="reloadData()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
        <div @click="resetSupplyForm(); resetValidationSupplyDetailErrors(); resetValidationSupplyErrors();"
          onclick="addSupplyModal.showModal()" class="tg-widget-btn mr-2 tooltip tooltip-left"
          data-tip="Add New Supply">
          <plus-icon class="tg-widget-btn-icon" />
        </div>
      </div>
    </div>
    <div class="tg-table-container">
      <table class="tg-table">
        <thead>
          <tr>
            <td class="!w-[120px]">Supply #</td>
            <td >Supplier</td>
            <td>Handled By</td>
            <td class="!w-[160px]">Supply Date</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supply in filteredSupplyDatas" :key="supply.Supply_ID">
            <td>{{ supply.Supply_ID }}</td>
            <td>{{ supply.Supplier_Name }}</td>
            <td>{{ supply.Employee_Name }}</td>
            <td>{{ new Date(supply.Supply_date).toLocaleString('default', {
              month: 'long', day: 'numeric', year:
                'numeric'
            }) }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px]">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="viewSupplyDetailsModal.showModal()" @click="
                    resetValidationSupplyDetailErrors();
                  selectedSupplyId = supply.Supply_ID;
                  supplyDetailForm.Supply_ID = supply.Supply_ID;
                  supplyDetailSearch.Supply_ID = supply.Supply_ID;
                  reloadData();
                  ">
                  View Details
                </button>
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="editSupplyModal.showModal()" @click="
                    resetValidationSupplyErrors();
                  supplyMessages.add = '';
                  selectedSupplyId = supply.Supply_ID;
                  supplyForm = { ...supply };
                  ">
                  Edit
                </button>
                <button onclick="deleteSupplyModal.showModal()" @click="
                  resetValidationSupplyErrors();
                supplyMessages.delete = '';
                selectedSupplyId = supply.Supply_ID;
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

  <!-- View Supply Details Modal -->
  <dialog id="viewSupplyDetailsModal" class="modal">
    <div class="modal-box !max-w-[800px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">View Supply Details</p>
        <div class="flex items-center">
          <p class="text-[11px]">for Supply #</p>
          <div class="text-[10px] ml-[5px] bg-[#b07166] text-white w-min m-min px-1 py-1 rounded-[15px]">
            {{ selectedSupplyId }}
          </div>
        </div>
      </div>
      <fieldset class="fieldset bg-base-200 border border-base-300 p-4 rounded-box">
        <div class="join">
          <div class="flex flex-col">
            <div>
              <input v-model="productVariantSearch" type="search" class="input join-item"
                placeholder="Search Product Name" />
              <label class="select">
                <select v-model="supplyDetailForm.Bar_Code" class="select join-item" required>
                  <option v-if="filteredProductVariantDatas.length === 0" value="" disabled>No Existing Products
                  </option>
                  <option v-for="product in filteredProductVariantDatas" :value="product.Bar_Code">
                    {{ product.Product_Name }} {{ Math.round(product.Unit_Weight * 100) / 100 }}{{ product.Unit_Size }}
                  </option>
                </select>
              </label>
              <button class="btn join-item shadow-none" @click="handleSubmitDetail">Add</button>
            </div>
            <p v-if="validationSupplyDetailErrors.Bar_Code" class="text-xs pt-1 !text-[#5e050a]">
                {{ validationSupplyDetailErrors.Bar_Code }}
              </p>
          </div>
        </div>
        <div class="join w-full">
          <div class="mr-2 flex flex-col">
            <label class="input">
              <span class="label">Quantity</span>
              <input v-model="supplyDetailForm.Quantity" type="number" class="input join-item" placeholder="Quantity"
                required />
            </label>
            <p v-if="validationSupplyDetailErrors.Quantity" class="text-xs pt-1 !text-[#5e050a]">
              {{ validationSupplyDetailErrors.Quantity }}
            </p>
          </div>
          <div class="mr-2 flex flex-col">
            <label class="input mr-2">
              <span class="label">Unit Price</span>
              <input v-model="supplyDetailForm.Unit_Price" type="number" class="input join-item"
                placeholder="Unit Price" required />
            </label>
            <p v-if="validationSupplyDetailErrors.Unit_Price" class="text-xs pt-1 !text-[#5e050a]">
              {{ validationSupplyDetailErrors.Unit_Price }}
            </p>
          </div>
          <div class="mr-2 flex flex-col">
            <label class="input">
              <span class="label">Expiry Date</span>
              <input v-model="supplyDetailForm.Expiry" type="date" class="input join-item" placeholder="Calendar"
                required />
            </label>
            <p v-if="validationSupplyDetailErrors.Expiry" class="text-xs pt-1 !text-[#5e050a]">
              {{ validationSupplyDetailErrors.Expiry }}
            </p>
          </div>
        </div>
      </fieldset>
      <!-- List -->
      <div>
        <ul class="list bg-base-100 rounded-box shadow-md mt-5">
          <li v-for="supplyDetail in filteredSupplyDetailDatas" :key="supplyDetail.SupplyDetail_ID" class="list-row">
            <div class="pr-5 border-r border-gray-300">
              <div>Supply Detail #</div>
              <div class="text-xs uppercase font-semibold opacity-60">{{ supplyDetail.SupplyDetail_ID }}</div>
            </div>
            <div>
              <div class="font-semibold flex items-center gap-2 mb-1">
                <div>{{ supplyDetail.Bar_Code }}</div>
                <div class="badge badge-outline badge-neutral">x {{ supplyDetail.Quantity }}</div>
                <span class="badge" :class="{
                  'badge-success': getStockOutRemark(supplyDetail.SupplyDetail_ID) === 'Active',
                  'badge-error': getStockOutRemark(supplyDetail.SupplyDetail_ID) !== 'Active',
                }">
                  {{ getStockOutRemark(supplyDetail.SupplyDetail_ID) }}
                </span>
              </div>
              <div class="text-xs uppercase font-semibold opacity-60">
                Unit Price: ₱{{ supplyDetail.Unit_Price }} | Expiry: {{ new
                  Date(supplyDetail.Expiry).toLocaleDateString() }} | SubTotal:
                ₱{{ supplyDetail.Subtotal }}
              </div>
            </div>
            <button @click="selectedSupplyDetailId = supplyDetail.SupplyDetail_ID;"
              onclick="deleteSupplyDetailModal.showModal()" class="btn btn-ghost border-gray-300">
              Delete
            </button>
            <button v-if="!stockOutSupplies.some(s => s.SupplyDetail_ID === supplyDetail.SupplyDetail_ID)"
              @click="stockOutSupplyForm.SupplyDetail_ID = supplyDetail.SupplyDetail_ID"
              onclick="removeSupplyDetailModal.showModal()" class="btn btn-ghost border-gray-300">
              Remove
            </button>
          </li>
        </ul>
      </div>
    </div>
  </dialog>

<!-- Remove Supply Detail Modal -->
<dialog id="removeSupplyDetailModal" class="modal">
  <div class="modal-box !max-w-fit ">
    <div class="leading-none mb-1">
      <p class="text-lg font-bold">Remove From Stocks</p>
      <div class="flex items-center">
        <p class="text-[11px]">for Supply No.</p>
        <div class="text-[10px] ml-[5px] bg-[#b07166] text-white w-min m-min px-1 py-1 rounded-[15px]">
          {{ selectedSupplyId }}
        </div>
      </div>
    </div>
    <fieldset class="fieldset !p-3 bg-base-200 border border-base-300 rounded-box mt-2">
      <div class="flex flex-col">
        <p class="text-xs pb-1">Select Reasons:</p>
        <select v-model="stockOutSupplyForm.Remarks_ID" class="rounded-[6px] px-2 py-1 max-w-xs">
          <option v-for="remark in remarkDatas" :value="remark.Remarks_ID" :key="remark.Remarks_ID">
            {{ remark.Remarks }}
          </option>
        </select>
      </div>
      <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ stockOutSupplyMessages.add }}</div>
    </fieldset>
    <div class="modal-action mt-4 flex items-center">
      <form method="dialog">
        <button class="btn shadow-xs h-7 mr-1 px-2 py-1 text-[12px]">Cancel</button>
      </form>
      <button @click="saveStockOutSupply(false)" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
        Stock Out
      </button>
    </div>
  </div>
</dialog>

<!-- Delete Supply Detail Modal -->
<dialog id="deleteSupplyDetailModal" class="modal">
  <div class="modal-box tg-modal p-0 !max-w-fit !min-w-[400px]">
    <div class="border-b-1 border-[#8a544a] mb-2 flex items-center pb-2 m-4">
      <p class="text-[16px] font-bold">Delete Supply Detail</p>
    </div>
    <div class="mb-4 pl-6 pt-0 pr-6 flex flex-col">
      <p class="text-[14px] font-medium">Do you really want to delete this supply detail?</p>
      <p class="text-[11px]">This action cannot be reversed</p>
    </div>
    <div class="tg-modal-delete">
      <form method="dialog">
        <button class="mt-1 btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
      </form>
      <button @click="deleteSupplyDetail()" class="mt-1 btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
        Delete
      </button>
    </div>
  </div>
</dialog>

<!-- Add Supply Modal -->
<dialog id="addSupplyModal" class="modal">
  <div class="modal-box !max-w-[300px]">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <div class="leading-none mb-1">
      <p class="text-lg font-bold">Add Supply Info</p>
    </div>
    <fieldset class="fieldset bg-base-200 border border-base-300 p-4 rounded-box">
      <div class="flex flex-col">
        <p class="text-xs pb-1">Supplier:</p>
        <select v-model="supplyForm.Supplier_id" class="rounded-[6px] px-2 py-1 max-w-xs">
          <option v-if="supplierDatas.length === 0" value="" disabled>No Existing Suppliers</option>
          <option v-else v-for="supplier in supplierDatas" :value="supplier.Supplier_ID" :key="supplier.Supplier_ID">
            {{ supplier.Supplier_Name }}
          </option>
        </select>
        <p v-if="validationSupplyErrors.Supplier_id" class="text-xs pt-1 !text-[#5e050a]">
          {{ validationSupplyErrors.Supplier_id }}
        </p>
      </div>
      <div class="pt-1 flex flex-col">
        <p class="text-xs pb-1">Supply Date:</p>
        <input v-model="supplyForm.Supply_date" type="date" class="rounded-[6px] px-2 py-1 max-w-xs" />
        <p v-if="validationSupplyErrors.Supply_date" class="text-xs pt-1 !text-[#5e050a]">
          {{ validationSupplyErrors.Supply_date }}
        </p>
      </div>
      <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ supplyMessages.add }}</div>
    </fieldset>
    <div class="modal-action">
      <button @click="handleSubmit(false)" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
        Create Supply
      </button>
    </div>
  </div>
</dialog>

<!-- Edit Supply Modal -->
<dialog id="editSupplyModal" class="modal">
  <div class="modal-box !max-w-fit">
    <div class="leading-none mb-1 flex items-center">
      <p class="text-lg font-bold">Edit Supply Info</p>
      <div class="text-[12px] ml-[10px] bg-[#b0594a] text-white badge">
        {{ supplierDatas.find(({ Supplier_ID }) => Supplier_ID === supplyForm.Supplier_id)?.Supplier_Name }}
      </div>
    </div>
    <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
      <div class="flex flex-col">
        <p class="text-xs pb-1">Supplier:</p>
        <select v-model="supplyForm.Supplier_id" class="rounded-[6px] px-2 py-1 max-w-xs">
          <option v-for="supplier in supplierDatas" :value="supplier.Supplier_ID" :key="supplier.Supplier_ID">
            {{ supplier.Supplier_Name }}
          </option>
        </select>
        <p v-if="validationSupplyErrors.Supplier_id" class="text-xs pt-1 !text-[#5e050a]">
          {{ validationSupplyErrors.Supplier_id }}
        </p>
      </div>
      <div class="pt-1 flex flex-col">
        <p class="text-xs pb-1">Supply Date:</p>
        <input v-model="supplyForm.Supply_date" type="date" class="rounded-[6px] px-2 py-1 max-w-xs" />
        <p v-if="validationSupplyErrors.Supply_date" class="text-xs pt-1 !text-[#5e050a]">
          {{ validationSupplyErrors.Supply_date }}
        </p>
      </div>
      <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ supplyMessages.edit }}</div>
    </fieldset>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
      </form>
      <button @click="handleSubmit(true)" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
        Edit Supply
      </button>
    </div>
  </div>
</dialog>

<!-- Delete Supply Modal -->
<dialog id="deleteSupplyModal" class="modal">
  <div class="modal-box tg-modal p-0 !max-w-fit !min-w-[400px]">
    <div class="border-b-1 border-[#8a544a] mb-2 flex items-center pb-2 m-4">
      <p class="text-[16px] font-bold">Delete Supply</p>
    </div>
    <div class="mb-4 pl-6 pt-0 pr-6 flex flex-col">
      <p class="text-[14px] font-medium">Do you really want to delete this supply?</p>
      <p class="text-[11px]">This action cannot be reversed</p>
      <div class="self-center mt-2 text-xs bg-[#9c2737] text-white w-min h-min m-min px-2 py-1 rounded-[10px]">
        {{ selectedSupplyId }}
      </div>
    </div>
    <div class="tg-modal-delete">
      <form method="dialog">
        <button class="mt-1 btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
      </form>
      <button @click="deleteSupply()" class="mt-1 btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
        Delete
      </button>
    </div>
  </div>
</dialog>
</template>