import { computed, ref, reactive, onMounted } from "vue";
import { CustomerData, customerService } from "../api/customer";

export function useCustomer(){
    const selectedCustomerId = ref<number>(-1);
    const customerSearch = ref("");
    const customerDatas = ref<CustomerData[]>([]);
    const messages = reactive({ edit: "", add: "", delete: "" });
    const initialCustomerForm = {
        id: 0,
        name: "",
        phone: "",
        address: "",
    };
    const customerForm = ref({ ...initialCustomerForm });
    const filteredCustomerDatas = computed(() => customerDatas.value.filter(
        c => c.name.toLowerCase().includes(customerSearch.value.toLowerCase() ?? '')
    ));

    const resetCustomerForm = () => {
        customerForm.value = { ...initialCustomerForm };
    }
    //Load
    const loadCustomer = async () => {
        try {
            const response = await customerService.getCustomers();
            customerDatas.value = response.data.map((c: any) => ({
                id: c.Customer_ID,
                name: c.Customer_Name,
                phone: c.Customer_PhoneNo,
                address: c.Customer_Address,
            }));
        } catch (err) {
            console.error("Error loading customers:", err);
        }
    };

    //Save
    const saveCustomer = async (isEdit: boolean) => {
        if (!customerForm.value.name || !customerForm.value.phone || !customerForm.value.address) {
            messages[isEdit ? "edit" : "add"] = "Please fill in all fields.";
            return;
        }
        const { name, phone, address } = customerForm.value;
        try {
            if (isEdit) {
                if(!selectedCustomerId.value) return (messages.edit = "No customer selected.");
                await customerService.updateCustomer(selectedCustomerId.value,
                    { name, phone, address }
                );
                (document.getElementById("editCustomerModal") as HTMLDialogElement).close();
                loadCustomer();

            } else {
                resetCustomerForm();
                const resp = await customerService.createCustomer({ name, phone, address });
                (document.getElementById("addCustomerModal") as HTMLDialogElement).close();
                resetCustomerForm();
                loadCustomer();
                return resp.data.customerId;
            }
        } catch (err) {
            console.error("Error saving customer:", err);
            messages[isEdit ? "edit" : "add"] = "Error saving customer.";
        }
    };

    //Delete
    const deleteCustomer = async () => {
        if (!selectedCustomerId.value) return (messages.delete = "No customer selected.");
        try {
            await customerService.deleteCustomer(selectedCustomerId.value);
            loadCustomer();
            (document.getElementById("deleteCustomerModal") as HTMLDialogElement).close();
        } catch (err) {
            console.error("Error deleting customer:", err);
            messages.delete = "Error deleting customer.";
        }
    };

    onMounted(loadCustomer);
    return { resetCustomerForm, selectedCustomerId, customerSearch, customerDatas, messages, customerForm, filteredCustomerDatas, loadCustomer, saveCustomer, deleteCustomer };
}