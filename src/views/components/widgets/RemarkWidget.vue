<script setup lang="ts">
import { PlusIcon, ArrowPathRoundedSquareIcon } from '@heroicons/vue/24/solid';
import { ref } from "vue";
import { useRemark } from "../../../composable/useRemark";

const {
  resetRemarkForm,
  selectedRemarkId,
  remarkDatas,
  messages,
  remarkForm,
  loadRemarks,
  saveRemark,
  deleteRemark,
} = useRemark();

const validationErrors = ref({
  Remarks: "",
});

const resetValidationErrors = () => {
  validationErrors.value = {
    Remarks: "",
  };
};

const validateRemarkForm = () => {
  validationErrors.value = {
    Remarks: remarkForm.value.Remarks ? "" : "Remark is required.",
  };

  return Object.values(validationErrors.value).every((error) => error === "");
};

const handleSubmit = (isEdit: boolean) => {
  if (validateRemarkForm()) {
    saveRemark(isEdit);
  }
};
</script>

<template>
  <div class="tg-widget max-w-[400px]">
    <div class="tg-widget-h">
      <div>Remarks</div>
      <div class="flex">
        <div @click="loadRemarks()" class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Refresh">
          <arrow-path-rounded-square-icon class="tg-widget-btn-icon" />
        </div>
        <div @click="resetRemarkForm(); resetValidationErrors();" onclick="addRemarkModal.showModal()"
          class="tg-widget-btn mr-2 tooltip tooltip-left" data-tip="Add New Remark">
          <plus-icon class="tg-widget-btn-icon" />
        </div>
      </div>
    </div>
    <div class="tg-table-container">
      <table class="tg-table">
        <thead>
          <tr>
            <td>Remark</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="remark in remarkDatas" :key="remark.Remarks_ID">
            <td>{{ remark.Remarks }}</td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px]">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="editRemarkModal.showModal()" @click="
                  messages.edit = '';
                  selectedRemarkId = remark.Remarks_ID;
                  remarkForm = { ...remark };
                  resetValidationErrors();
                ">
                  Edit
                </button>
                <button onclick="deleteRemarkModal.showModal()" @click="
                  messages.delete = '';
                  selectedRemarkId = remark.Remarks_ID;
                  remarkForm = { ...remark };
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

  <!-- Add Remark Modal -->
  <dialog id="addRemarkModal" class="modal">
    <div class="modal-box !max-w-fit">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1">
        <p class="text-lg font-bold">Add Remark Info</p>
      </div>
      <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <div class="flex flex-col">
          <p class="text-xs pb-1">Remark:</p>
          <input v-model="remarkForm.Remarks" type="text" placeholder="Remark"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Remarks" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Remarks }}
          </p>
        </div>
        <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ messages.add }}</div>
      </fieldset>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="handleSubmit(false)" class="btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Create Remark
        </button>
      </div>
    </div>
  </dialog>

  <!-- Edit Remark Modal -->
  <dialog id="editRemarkModal" class="modal">
    <div class="modal-box !max-w-fit">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="leading-none mb-1 flex items-center">
        <p class="text-lg font-bold">Edit Remark Info</p>
        <div class="text-[12px] ml-[10px] bg-[#b0594a] text-white badge">
          {{ remarkDatas.find(({ Remarks_ID }) => Remarks_ID === selectedRemarkId)?.Remarks }}
        </div>
      </div>
      <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <div class="flex flex-col">
          <p class="text-xs pb-1">Remark:</p>
          <input v-model="remarkForm.Remarks" type="text" placeholder="Remark"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Remarks" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Remarks }}
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

  <!-- Delete Remark Modal -->
  <dialog id="deleteRemarkModal" class="modal">
    <div class="modal-box tg-modal p-0 !max-w-fit !min-w-[400px]">
      <div class="border-b-1 border-[#8a544a] mb-2 flex items-center pb-2 m-4">
        <p class="text-[16px] font-bold">Delete Remark</p>
      </div>
      <div class="mb-4 pl-6 pt-0 pr-6 flex flex-col">
        <p class="text-[14px] font-medium">Do you really want to delete this remark?</p>
        <p class="text-[11px]">This action cannot be reversed</p>
        <div class="self-center mt-2 text-xs bg-[#9c2737] text-white w-min h-min m-min px-2 py-1 rounded-[10px]">
          {{ remarkForm.Remarks }}
        </div>
      </div>
      <div class="tg-modal-delete">
        <form method="dialog">
          <button class="mt-1 btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="deleteRemark()" class="mt-1 btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Delete
        </button>
      </div>
    </div>
  </dialog>
</template>