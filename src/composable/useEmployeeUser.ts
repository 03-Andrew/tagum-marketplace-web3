import { computed, ref, reactive, onMounted } from "vue";
import { EmployeeUserData, employeeUserService } from "../api/employeeUser";
import { AxiosError } from "axios";

export const useEmployeeUser = () => {
    const selectedEmployeeId = ref<number>(0);
    const employeeUserSearch = ref({name: "",role:""});
    const EmployeeUserDatas = ref<EmployeeUserData[]>([]);
    const messages = reactive({ edit: "", add: "", delete: "" });
    const initialEmployeeUserForm = {
        Employee_ID: 0,
        Employee_Name: "",
        Employee_DOB: new Date(),
        Employee_Gender: "",
        Employee_Address: "",
        Employee_ContactNo: "",
        Username: "",
        Role: "",
        Password:"",
        User_DateReg: new Date(),
    };
    const employeeUserForm = ref({ ...initialEmployeeUserForm });
    const filteredEmployeeUserDatas = computed(() =>
        EmployeeUserDatas.value.filter(({ Employee_Name, Role }) =>
            Employee_Name.toLowerCase().includes(employeeUserSearch.value.name.toLowerCase()) 
            && Role.toLowerCase().includes(employeeUserSearch.value.role.toLowerCase())
        )
    );

    const resetEmployeeUserForm = () => {
        employeeUserForm.value = { ...initialEmployeeUserForm };
    };

    //Load
    const loadEmployeeUsers = async () => {
        try {
            const response = await employeeUserService.getEmployeeUsers();
            EmployeeUserDatas.value = response.data;
        } catch (err) {
            console.error("Error loading employees:", err);
        }
    };
    
    //Save
    const saveEmployeeUser = async (isEdit: boolean) => {
        if (!employeeUserForm.value.Employee_Name 
            || !employeeUserForm.value.Employee_Gender 
            || !employeeUserForm.value.Employee_DOB
            || !employeeUserForm.value.Employee_ContactNo
            || !employeeUserForm.value.Employee_Address
            || !employeeUserForm.value.Username
            || !employeeUserForm.value.Role) {
            messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
            return;
        }
        const {  } = employeeUserForm.value;
        try {
            if (isEdit) {
                if(!selectedEmployeeId.value) return (messages.edit = "No employee selected.");
                await employeeUserService.updateEmployeeUser(selectedEmployeeId.value,
                    {
                        employeeName: employeeUserForm.value.Employee_Name,
                        employeeDOB: employeeUserForm.value.Employee_DOB,
                        employeeGender: employeeUserForm.value.Employee_Gender,
                        employeeAddress: employeeUserForm.value.Employee_Address,
                        employeeContactNo: employeeUserForm.value.Employee_ContactNo,
                        username: employeeUserForm.value.Username,
                        password: employeeUserForm.value.Password,
                        role: employeeUserForm.value.Role
                    }
                );
                (document.getElementById("editEmployeeUserModal") as HTMLDialogElement).close();
                loadEmployeeUsers();

            } else {
                const resp = await employeeUserService.createEmployeeUser({
                    employeeName: employeeUserForm.value.Employee_Name,
                    employeeDOB: employeeUserForm.value.Employee_DOB,
                    employeeGender: employeeUserForm.value.Employee_Gender,
                    employeeAddress: employeeUserForm.value.Employee_Address,
                    employeeContactNo: employeeUserForm.value.Employee_ContactNo,
                    username: employeeUserForm.value.Username,
                    password: employeeUserForm.value.Password,
                    role: employeeUserForm.value.Role
                });
                (document.getElementById("addEmployeeUserModal") as HTMLDialogElement).close();
                loadEmployeeUsers();
                return resp.data.employeeId;
            }
        }
        catch (err:AxiosError | any) {
            messages[isEdit ? "edit" : "add"] = err.response.data.error;
        }
    };
    //Delete
    const deleteEmployeeUser = async () => {
        if (!selectedEmployeeId.value) return (messages.delete = "No employee selected.");
        try {
            await employeeUserService.deleteEmployeeUser(selectedEmployeeId.value);
            loadEmployeeUsers();
            (document.getElementById("deleteEmployeeUserModal") as HTMLDialogElement).close();
        } catch (err) {
            console.error("Error deleting employee:", err);
            messages.delete = "Error deleting employee.";
        }
    };

    onMounted(loadEmployeeUsers);
    return { 
        selectedEmployeeId,
        employeeUserSearch,
        EmployeeUserDatas,
        messages,
        deleteEmployeeUser,
        employeeForm: employeeUserForm,
        filteredEmployeeUserDatas,
        resetEmployeeUserForm,
        saveEmployeeUser
    };
}
