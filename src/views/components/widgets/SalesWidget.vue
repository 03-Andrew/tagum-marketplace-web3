<script setup lang="ts">
import {
  PlusIcon,
  ArrowPathRoundedSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/solid";
import { ref, computed } from "vue";
import { useSale } from "../../../composable/useSale";
import { useCustomer } from "../../../composable/useCustomer";
import { useProductVariant } from "../../../composable/useProductVariant";
import { useSaleDetail } from "../../../composable/useSaleDetail";

const {
  selectedSaleId,
  saleSearch,
  saleDatas,
  filteredSaleDatas,
  messages: saleMessages,
  saleForm,
  loadSale,
  saveSale,
  deleteSale,
} = useSale();

const {
  productVariantDatas,
  filteredProductVariantDatas,
  selectedProductVariantId,
} = useProductVariant();

const {
  saleDetailForm,
  resetSaleDetailForm,
  addSaveDetails,
  saleDetailDatas,
  deleteSaleDetail,
  saleDetailSearch,
  filteredSaleDetailDatas,
} = useSaleDetail();

const {
  selectedCustomerId,
  filteredCustomerDatas,
  customerForm,
  saveCustomer,
  resetCustomerForm,
} = useCustomer();

/*Exclusive for SalesWidget :)*/
interface SaleDetailData {
  barCode: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}
interface SaleDetailCreate {
  barCode: string;
  unitPrice: number;
  quantity: number;
}

const orderDetails = ref<SaleDetailData[]>([]);

const addToOrderDetails = () => {
  if (!selectedProductVariantId.value) {
    saleMessages.add = "A product variant must be selected.";
    return;
  }
  if (saleDetailForm.value.quantity <= 0) {
    saleMessages.add = "Quantity must be greater than zero.";
    return;
  }

  const productVariant = productVariantDatas.value.find(
    (e) => e.Bar_Code === selectedProductVariantId.value
  );

  if (!productVariant) {
    saleMessages.add = "Selected product variant not found.";
    return;
  }

  if (productVariant.Inventory_Quantity < saleDetailForm.value.quantity) {
    saleMessages.add = "Not enough quantity in inventory.";
    return;
  }

  const existingOrder = orderDetails.value.find(
    (e) => e.barCode === selectedProductVariantId.value
  );

  if (existingOrder) {
    existingOrder.quantity += saleDetailForm.value.quantity;
  } else {
    orderDetails.value.push({
      barCode: selectedProductVariantId.value ?? "",
      unitPrice: productVariant.Unit_Price || 0,
      productName: productVariant.Product_Name || "",
      quantity: saleDetailForm.value.quantity,
    });
  }
  saleMessages.add = "";
  resetSaleDetailForm();
};

const processSale = async () => {
  const saleDetailCreates: SaleDetailCreate[] = orderDetails.value.map(
    (detail) => ({
      barCode: detail.barCode,
      unitPrice: detail.unitPrice,
      quantity: detail.quantity,
    })
  );
  if (saleDetailCreates.length === 0) {
    saleMessages.add = "There must be at least one sale detail.";
    return;
  }
  if (selectedCustomerId.value == -1) {
    selectedCustomerId.value = await saveCustomer(false);
  }
  if (selectedCustomerId.value === undefined) {
    saleMessages.add = "No customer selected.";
    return;
  }
  saleForm.customerId = selectedCustomerId.value;
  const id = await saveSale(false);
  addSaveDetails(id, saleDetailCreates);
  orderDetails.value = [];
  resetSaleDetailForm();
  resetCustomerForm();
  selectedCustomerId.value = -1;
  selectedProductVariantId.value = "";
};

function getTotalAmount(saleId: number) {
  const sale = saleDatas.value.find((sale) => sale.id === saleId);
  if (!sale) return 0;
  const saleDetails = saleDetailDatas.value.filter(
    (saleDetail) => saleDetail.saleId === saleId
  );
  return saleDetails.reduce(
    (total, saleDetail) => total + saleDetail.subTotal,
    0
  );
}

const isNewCustomer = computed(() => selectedCustomerId.value === -1);

const validationErrors = ref({
  customerName: "",
  customerAddress: "",
  customerPhone: "",
  productVariant: "",
  quantity: "",
});

const resetValidationErrors = () => {
  validationErrors.value = {
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    productVariant: "",
    quantity: "",
  };
};

const validateForm = () => {
  validationErrors.value = {
    customerName: isNewCustomer.value && !customerForm.value.name ? "Customer Name is required." : "",
    customerAddress: isNewCustomer.value && !customerForm.value.address ? "Customer Address is required." : "",
    customerPhone: isNewCustomer.value && !customerForm.value.phone ? "Customer Phone is required." : "",
    productVariant: !selectedProductVariantId.value ? "Product is required." : "",
    quantity: saleDetailForm.value.quantity <= 0 ? "Quantity must not be below 0." : "",
  };

  return Object.values(validationErrors.value).every((error) => error === "");
};

const handleSubmit = () => {
  if (validateForm()) {
    processSale();
  }
};
</script>

<template>
  <div class="tg-widget w-[100%]">
    <div class="tg-widget-h">
      <div>Sales</div>
      <div class="flex">
        <label class="input text-[14px] text-black h-[32px] min-w-[250px] mr-2 grow bg-[#f7f2f2]">
          <magnifying-glass-icon class="h-[20px] pr-1" />
          <input v-model="saleSearch" type="search" class="grow" placeholder="Search Sale By Customer Name" />
        </label>
        <div @click="loadSale()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
        <div onclick="addSaleModal.showModal()" 
        @click="resetValidationErrors(); resetSaleDetailForm(); resetCustomerForm(); selectedCustomerId = -1; selectedProductVariantId = '';"
        class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Sale">
          <plus-icon class="tg-widget-btn-icon" />
        </div>
      </div>
    </div>
    <div class="tg-table-container">
      <table class="tg-table">
        <thead>
          <tr>
            <td>Sales #</td>
            <td>Customer Name</td>
            <td>Cashier</td>
            <td>Sales Date</td>
            <td>Total Amount</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in filteredSaleDatas" :key="sale.id">
            <td>{{ sale.id }}</td>
            <td>{{ sale.customerName || "N/A" }}</td>
            <td>{{ sale.employeeName }}</td>
            <td>{{ new Date(sale.date).toLocaleString() }}</td>
            <td>₱{{ getTotalAmount(sale.id) }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px]">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="viewSaleDetails.showModal()" 
                  @click="
                  resetValidationErrors();
                  saleDetailSearch = sale.id">
                  View Order Details
                </button>
                <button @click="selectedSaleId = sale.id" onclick="deleteSaleModal.showModal()"
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

  <!-- Add Sale Modal -->
  <dialog id="addSaleModal" class="modal">
    <div class="modal-box !max-w-[700px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Create Sale</p>
      </div>
      <fieldset class="fieldset bg-base-200 border border-base-300 p-4 rounded-box">
        <legend class="fieldset-legend">Customer Details</legend>
        <div class="join">
          <div class="flex flex-col grow mr-3">
            <p class="text-xs pb-1">Customer:</p>
            <select v-model="selectedCustomerId" class="rounded-[6px] h-[27px] px-2 py-1 max-w-xs">
              <option :value="-1">New Customer</option>
              <option v-for="customer in filteredCustomerDatas" :key="customer.id" :value="customer.id">
                {{ customer.name }} - {{ customer.address }}
              </option>
            </select>
          </div>
          <div v-if="isNewCustomer" class="grow flex flex-col">
            <p class="text-xs pb-1">Customer Name:</p>
            <input v-model="customerForm.name" type="text" placeholder="Customer Name"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
            <p v-if="validationErrors.customerName" class="text-xs pt-1 !text-[#5e050a]">
              {{ validationErrors.customerName }}
            </p>
          </div>
        </div>
        <div class="join">
          <div v-if="isNewCustomer" class="grow flex flex-col mr-3 ">
            <p class="text-xs pb-1">Customer Address:</p>
            <input v-model="customerForm.address" type="text" placeholder="Customer Address"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
            <p v-if="validationErrors.customerAddress" class="text-xs pt-1 !text-[#5e050a]">
              {{ validationErrors.customerAddress }}
            </p>
          </div>
          <div v-if="isNewCustomer" class="grow flex flex-col">
            <p class="text-xs pb-1">Customer Phone:</p>
            <input v-model="customerForm.phone" type="text" placeholder="Customer Phone"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
            <p v-if="validationErrors.customerPhone" class="text-xs pt-1 !text-[#5e050a]">
              {{ validationErrors.customerPhone }}
            </p>
          </div>
        </div>
      </fieldset>
      <fieldset class="fieldset bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <legend class="fieldset-legend">Product Details</legend>
        <div class="join">
          <div class="flex flex-col grow mr-3">
            <p class="text-xs pb-1">Product:</p>
            <select v-model="selectedProductVariantId" class="rounded-[6px] px-2 py-1 max-w-xs">
              <option v-for="product in filteredProductVariantDatas" :key="product.Bar_Code" :value="product.Bar_Code">
                {{ product.Bar_Code }} - {{ product.Product_Name }}
              </option>
            </select>
            <p v-if="validationErrors.productVariant" class="text-xs pt-1 !text-[#5e050a]">
              {{ validationErrors.productVariant }}
            </p>
          </div>
          <div class="flex flex-col grow">
            <p class="text-xs pb-1">Quantity:</p>
            <input v-model="saleDetailForm.quantity" type="number" placeholder="Quantity"
              class="rounded-[6px] px-2 py-1 max-w-xs" />
            <p v-if="validationErrors.quantity" class="text-xs pt-1 !text-[#5e050a]">
              {{ validationErrors.quantity }}
            </p>
          </div>
        </div>
        <div class="flex flex-col">
          <p class="text-xs">Subtotal:</p>
          <p>
            ₱{{
              (productVariantDatas.find(
                (e) => e.Bar_Code === selectedProductVariantId
              )?.Unit_Price || 0) * saleDetailForm.quantity
            }}
          </p>
          
        </div>
        <div v-if="saleMessages.add" class="text-xs pt-2 text-[#5e050a] text-wrap">{{ saleMessages.add }}</div>
        <button @click="addToOrderDetails()" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px] mt-2">
          Add Product
        </button>
      </fieldset>
      <div class="mt-4">
        <ul class="list bg-base-100 rounded-box shadow-md">
          <li v-for="order in orderDetails" :key="order.barCode" class="list-row">
            <div class="pr-5 border-r border-gray-300">
              <div>Bar Code</div>
              <div class="text-xs uppercase font-semibold opacity-60">
                {{ order.barCode }}
              </div>
            </div>
            <div>
              <div class="font-semibold">{{ order.productName }}</div>
              <div class="text-xs uppercase font-semibold opacity-60">
                QUANTITY: {{ order.quantity }} PCS, SUBTOTAL: ₱{{
                  order.unitPrice * order.quantity
                }}
              </div>
            </div>
            <button @click="orderDetails = orderDetails.filter((o) => o.barCode !== order.barCode)"
              class="btn btn-ghost border-gray-300">
              Remove
            </button>
          </li>
        </ul>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="handleSubmit()" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Create Sale
        </button>
      </div>
    </div>
  </dialog>

  <!-- View Sale Details Modal -->
  <dialog id="viewSaleDetails" class="modal">
    <div class="modal-box !max-w-[700px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">View Sale Details</p>
      </div>
      <div>
        <ul class="list bg-base-100 rounded-box shadow-md mt-5">
          <li v-for="order in filteredSaleDetailDatas" :key="order.barCode" class="list-row">
            <div class="pr-5 border-r border-gray-300">
              <div>Bar Code</div>
              <div class="text-xs uppercase font-semibold opacity-60">
                {{ order.barCode }}
              </div>
            </div>
            <div>
              <div class="font-semibold">
                {{
                  productVariantDatas.find(
                    (e) => e.Bar_Code === order.barCode
                  )?.Product_Name
                }}
              </div>
              <div class="text-xs uppercase font-semibold opacity-60">
                QUANTITY: {{ order.quantity }} PCS, SUBTOTAL: ₱{{
                  order.unitPrice * order.quantity
                }}
              </div>
            </div>
            <button @click="deleteSaleDetail(order.barCode, order.saleId)" class="btn btn-ghost border-gray-300">
              Remove
            </button>
          </li>
        </ul>
      </div>
    </div>
  </dialog>

  <!-- Delete Sale Modal -->
  <dialog id="deleteSaleModal" class="modal">
    <div class="modal-box tg-modal p-0 !max-w-fit !min-w-[400px]">
      <div class="border-b-1 border-[#8a544a] mb-2 flex items-center pb-2 m-4">
        <p class="text-[16px] font-bold">Delete Sale</p>
      </div>
      <div class="mb-4 pl-6 pt-0 pr-6 flex flex-col">
        <p class="text-[14px] font-medium">Do you really want to delete this sale?</p>
        <p class="text-[11px]">This action cannot be reversed</p>
        <div class="self-center mt-2 text-xs bg-[#9c2737] text-white w-min h-min m-min px-2 py-1 rounded-[10px]">
          {{ selectedSaleId }}
        </div>
      </div>
      <div class="tg-modal-delete">
        <form method="dialog">
          <button class="mt-1 btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="deleteSale()" class="mt-1 btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Delete
        </button>
      </div>
    </div>
  </dialog>
</template>