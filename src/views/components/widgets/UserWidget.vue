<script setup lang="ts">
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/vue/24/solid";
import { useEmployeeUser } from "../../../composable/useEmployeeUser";
import { ref } from "vue";
// data interfacess

const {
  selectedEmployeeId,
  employeeUserSearch,
  messages,
  employeeForm,
  EmployeeUserDatas,
  filteredEmployeeUserDatas,
  saveEmployeeUser,
  deleteEmployeeUser,
  resetEmployeeUserForm
} = useEmployeeUser();

//User Validation
const validatePhoneNumber = (phone: string): boolean => {
  const regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  return regex.test(phone);
};

const validationErrors = ref({
  Employee_Name: "",
  Username: "",
  Employee_DOB: "",
  Employee_Address: "",
  Employee_Gender: "",
  Employee_ContactNo: "",
  Role: "",
  Password: "",
});
const resetValidationErrors = () => {
  validationErrors.value = {
    Employee_Name: "",
    Username: "",
    Employee_DOB: "",
    Employee_Address: "",
    Employee_Gender: "",
    Employee_ContactNo: "",
    Role: "",
    Password: "",
  };
};

const validateForm = () => {
  validationErrors.value = {
    Employee_Name: employeeForm.value.Employee_Name ? "" : "Full Name is required.",
    Username: employeeForm.value.Username ? "" : "Username is required.",
    Employee_DOB: employeeForm.value.Employee_DOB ? "" : "Date of Birth is required.",
    Employee_Address: employeeForm.value.Employee_Address ? "" : "Address is required.",
    Employee_Gender: employeeForm.value.Employee_Gender ? "" : "Gender is required.",
    Employee_ContactNo: validatePhoneNumber(employeeForm.value.Employee_ContactNo) ? "" : "Invalid phone number.",
    Role: employeeForm.value.Role ? "" : "Role is required.",
    Password: selectedEmployeeId.value === 0 && !employeeForm.value.Password ? "Password is required." : "",
  };

  return Object.values(validationErrors.value).every((error) => error === "");
};

const handleSubmit = (isEdit: boolean) => {
  if (validateForm()) {
    saveEmployeeUser(isEdit);
  }
};

</script>
<template>
  <div class="font-med text-[18px] text-white tracking-tighter">
    User Management
  </div>
  <div class="flex items-center bg-[#804c4c] w-[100%] py-2 px-3 rounded-[13px] shadow-md">
    <label class="input text-[14px] h-[32px] grow  bg-[#f7f2f2]">
      <magnifying-glass-icon class="h-[20px] pr-1" />
      <input type="search" placeholder="Search By Full Name" v-model="employeeUserSearch.name" />
    </label>
    <div class="flex justify-end">
      <div class="dropdown dropdown-end tooltip" data-tip="Only show a specific role.">
        <div tabindex="0" role="button"
          class="flex btn h-[34px] px-3 shadow-md bg-[#f7f0f0] ml-2 border-[#4d2f2d] radius-[3px]">
          <p>Filter</p>
        </div>
        <ul tabindex="0"
          class="dropdown-content menu bg-[#1f1619] mt-[3px] rounded-box z-[1] w-34 shadow-lg text-white">
          <li>
            <a :class="{ 'bg-[#140E12]': employeeUserSearch.role === '' }" @click="employeeUserSearch.role = ''">All</a>
          </li>
          <li>
            <a :class="{ 'bg-[#140E12]': employeeUserSearch.role === 'Cashier' }"
              @click="employeeUserSearch.role = 'Cashier'">Cashier</a>
          </li>
          <li>
            <a :class="{ 'bg-[#140E12]': employeeUserSearch.role === 'Stockman' }"
              @click="employeeUserSearch.role = 'Stockman'">Stockman</a>
          </li>
          <li>
            <a :class="{ 'bg-[#140E12]': employeeUserSearch.role === 'Admin' }"
              @click="employeeUserSearch.role = 'Admin'">Administrator</a>
          </li>
        </ul>
      </div>

      <button onclick="addEmployeeUserModal.showModal()" @click="
        resetValidationErrors();
        resetEmployeeUserForm();
      messages.add = '';
      selectedEmployeeId = 0" class="flex btn h-[34px] px-3 shadow-md bg-[#f7f0f0] ml-2 border-[#4d2f2d] radius-[3px]">
        <p>Create User</p>
        <plus-icon class="h-[16px]" />
      </button>
    </div>
  </div>
  <div class="tg-widget !p-[13px] h-[100%] rounded-[13px] bg-[#744e4e] text-white p-[13px] shadow-md flex">
    <div class="tg-table-container tg-main-table">
      <table class="tg-table">
        <thead>
          <tr>
            <td class="!w-[60px]">ID #</td>
            <td>Full Name</td>
            <td>Username</td>
            <td>Date of Birth</td>
            <td>Address</td>
            <td class="!w-[75px]">Gender</td>
            <td>Contact No.</td>
            <td>Date Registered</td>
            <td class="!w-[90px]">Role</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="EmployeeData in filteredEmployeeUserDatas" :key="EmployeeData.Employee_ID">
            <td>{{ EmployeeData.Employee_ID }}</td>
            <td>{{ EmployeeData.Employee_Name }}</td>
            <td>{{ EmployeeData.Username }}</td>
            <td>{{ new Date(EmployeeData.Employee_DOB).toLocaleString('default', {
              month: 'long', day: 'numeric', year:
                'numeric'
            }) }}</td>
            <td class="whitespace-normal break-words">{{ EmployeeData.Employee_Address }}</td>
            <td>{{ EmployeeData.Employee_Gender }}</td>
            <td>{{ EmployeeData.Employee_ContactNo }}</td>
            <td>{{ new Date(EmployeeData.User_DateReg).toLocaleString('default', {
              month: 'long', day: 'numeric', year:
                'numeric'
            }) }}</td>
            <td>
              <div class="text-xs text-white w-min m-min badge" :class="{
                'bg-[#6671b0]': EmployeeData.Role === 'cashier',
                'bg-[#4e8253]': EmployeeData.Role === 'stockman',
                'bg-[#f2227c]': EmployeeData.Role === 'admin',
              }">
                {{ EmployeeData.Role }}
              </div>
            </td>
            <td>
              <div class="flex gap-[10px] justify-start !pr-[20px]">
                <button class="btn h-[25px] p-[12px] shadow-md bg-[#f5e6e6] border-none"
                  onclick="editEmployeeUserModal.showModal()" @click="
                  resetValidationErrors();
                    messages.edit = '';
                  employeeForm = { ...EmployeeData, Password: '' };
                  selectedEmployeeId = EmployeeData.Employee_ID;
                  ">
                  Edit
                </button>
                <button onclick="deleteEmployeeUserModal.showModal()" @click="
                resetValidationErrors();
                  messages.delete = '';
                employeeForm = { ...EmployeeData, Password: '' };
                selectedEmployeeId = EmployeeData.Employee_ID"
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



  <dialog id="editEmployeeUserModal" class="modal">
    <div class="modal-box !max-w-fit">
      <div class="leading-none mb-1 flex items-center">
        <p class="text-lg font-bold">Edit User Info</p>
        <div class="text-[12px] ml-[10px] bg-[#b0594a] text-white badge">
          {{EmployeeUserDatas.find((item) => item.Employee_ID === selectedEmployeeId)?.Username}}
        </div>

      </div>
      <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <div class="flex flex-col">
          <p class="text-xs pb-1">Full Name:</p>
          <input v-model="employeeForm.Employee_Name" type="text" placeholder="Full Name"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Employee_Name" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Employee_Name }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Username:</p>
          <input v-model="employeeForm.Username" type="text" placeholder="Username"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Username" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Username }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Date of Birth:</p>
          <input v-model="employeeForm.Employee_DOB" type="date" placeholder="Full Name"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Employee_DOB" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Employee_DOB }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Address:</p>
          <input v-model="employeeForm.Employee_Address" type="text" placeholder="Address"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Employee_Address" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Employee_Address }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Gender:</p>
          <select v-model="employeeForm.Employee_Gender" class="rounded-[6px] px-2 py-1 max-w-xs">
            <option disabled selected>Select Your Gender</option>
            <option id="Male" value="Male">Male</option>
            <option id="Female" value="Female">Female</option>
            <option id="Others" value="Others">Others</option>
          </select>
          <p v-if="validationErrors.Employee_Gender" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Employee_Gender }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Contact Number:</p>
          <input v-model="employeeForm.Employee_ContactNo" type="tel" placeholder="Contact Number"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Employee_ContactNo" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Employee_ContactNo }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Role:</p>
          <select v-model="employeeForm.Role" class="rounded-[6px] px-2 py-1 max-w-xs">
            <option disabled selected>Role</option>
            <option id="Cashier" value="cashier">Cashier</option>
            <option id="Stockman" value="stockman">Stockman</option>
            <option id="Admin" value="admin">Admin</option>
          </select>
          <p v-if="validationErrors.Role" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Role }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">New Password:</p>
          <input v-model="employeeForm.Password" type="text" placeholder="New Password"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Password" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Password }}
          </p>
        </div>
        <div class="text-xs pt-2 text-[#5e050a] text-wrap">
          {{ messages.edit }}
        </div>
      </fieldset>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn h-[35px] p-[12px] shadow-md bg-[#f57267] border-none">Close</button>
        </form>
        <button @click="handleSubmit(true)" class="btn h-[35px] p-[12px] shadow-md border-none">
          Save User Info
        </button>
      </div>
    </div>
  </dialog>
  <!--Delete Modal-->
  <dialog id="deleteEmployeeUserModal" class="modal">
    <div class="modal-box tg-modal p-0 !max-w-fit !min-w-[400px]">
      <div class="border-b-1 border-[#8a544a] mb-2 flex items-center pb-2 m-4">
        <p class="text-[16px] font-bold">Delete User</p>
      </div>
      <div class="mb-4 pl-6 pt-0 pr-6 flex flex-col">
        <p class="text-[14px] font-medium">Do you really want to delete this user?</p>
        <p class="text-[11px]">This action cannot be reversed</p>
        <div class="self-center mt-2 text-xs bg-[#9c2737] text-white w-min h-min m-min px-2 py-1 rounded-[10px]">
          {{ employeeForm.Username }}
        </div>
      </div>
      <div class="tg-modal-delete">
        <form method="dialog">
          <button class="mt-1 btn shadow-xs h-7 mr-2 px-2 py-1 text-[12px]">Cancel</button>
        </form>
        <button @click="deleteEmployeeUser()" class="mt-1 btn btn-error shadow-xs h-7 px-2 py-1 text-[12px]">
          Delete User
        </button>
      </div>
    </div>
  </dialog>
  <!--Add User Modal-->
  <dialog id="addEmployeeUserModal" class="modal">
    <div class="modal-box !max-w-fit">
      <p class="text-lg font-bold">Create New User</p>
      <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mt-2">
        <div class="flex flex-col">
          <p class="text-xs pb-1">Full Name:</p>
          <input v-model="employeeForm.Employee_Name" type="text" placeholder="Full Name"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Employee_Name" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Employee_Name }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Username:</p>
          <input v-model="employeeForm.Username" type="text" placeholder="Username"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Username" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Username }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Date of Birth:</p>
          <input v-model="employeeForm.Employee_DOB" type="date" placeholder="Full Name"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Employee_DOB" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Employee_DOB }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Address:</p>
          <input v-model="employeeForm.Employee_Address" type="text" placeholder="Address"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Employee_Address" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Employee_Address }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Gender:</p>
          <select v-model="employeeForm.Employee_Gender" class="rounded-[6px] px-2 py-1 max-w-xs">
            <option disabled selected>Select Your Gender</option>
            <option id="Male" value="Male">Male</option>
            <option id="Female" value="Female">Female</option>
            <option id="Others" value="Others">Others</option>
          </select>
          <p v-if="validationErrors.Employee_Gender" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Employee_Gender }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Contact Number:</p>
          <input v-model="employeeForm.Employee_ContactNo" type="text" placeholder="Contact Number"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Employee_ContactNo" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Employee_ContactNo }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Role:</p>
          <select v-model="employeeForm.Role" class="rounded-[6px] px-2 py-1 max-w-xs">
            <option disabled selected>Role</option>
            <option id="Cashier" value="cashier">Cashier</option>
            <option id="Stockman" value="stockman">Stockman</option>
            <option id="Admin" value="admin">Admin</option>
          </select>
          <p v-if="validationErrors.Role" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Role }}
          </p>
        </div>
        <div class="pt-1 flex flex-col">
          <p class="text-xs pb-1">Password:</p>
          <input v-model="employeeForm.Password" type="text" placeholder="Password"
            class="rounded-[6px] px-2 py-1 max-w-xs" />
          <p v-if="validationErrors.Password" class="text-xs pt-1 !text-[#5e050a]">
            {{ validationErrors.Password }}
          </p>
        </div>
        <div class="text-xs pt-2 text-[#5e050a] text-wrap">{{ messages.add }}</div>
      </fieldset>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn h-[35px] p-[12px] shadow-md bg-[#f57267] border-none">Close</button>
        </form>
        <button @click="handleSubmit(false)" class="btn h-[35px] p-[12px] shadow-md border-none">
          Create User
        </button>
      </div>
    </div>
  </dialog>
</template>
