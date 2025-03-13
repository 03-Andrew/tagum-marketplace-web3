import { computed, ref, reactive, onMounted } from "vue";
import { BrandData, brandService } from "../api/brand";
import { AxiosError } from "axios";

export function useBrand() {
    const selectedBrandId = ref<number>(0);
    const brandSearch = ref("");
    const brandDatas = ref<BrandData[]>([]);
    const messages = reactive({ edit: "", add: "", delete: "" });
    const initialBrandForm = { Brand_ID: 0, Brand_Name: "" };
    const brandForm = ref({ ...initialBrandForm });
    
    const resetBrandForm = () => {
        brandForm.value = { ...initialBrandForm };
    }
    const filteredBrandDatas = computed(() =>
        brandDatas.value.filter(({ Brand_Name }) =>
          Brand_Name.toLowerCase().includes(brandSearch.value.toLowerCase())
    )
    );
    //Load
    const loadBrand = async () => {
        try {
          const response = await brandService.getBrands();
          brandDatas.value = response.data;
        } catch (err) {
          console.error("Error loading brands:", err);
        }
    };
    //Save
    const saveBrand = async (isEdit: boolean) => {
        if (!brandForm.value.Brand_Name) {
          messages[isEdit ? "edit" : "add"] = "Please fill in the name.";
          return;
        }
      
        try {
          if (isEdit) {
            if(!selectedBrandId.value) return (messages.edit = "No brand selected.");
            await brandService.updateBrand(selectedBrandId.value,{
              name: brandForm.value.Brand_Name

            });
            (document.getElementById("editBrandModal") as HTMLDialogElement).close();

          } else {
            await brandService.createBrand({
              name: brandForm.value.Brand_Name
            });
            (document.getElementById("addBrandModal") as HTMLDialogElement).close();

          }
          
          loadBrand();
        } catch (err: AxiosError | any) {
          messages[isEdit ? "edit" : "add"] = err.response.data.message;
        }
      };
    //Delete
    const deleteBrand = async () => {
        if (!selectedBrandId.value) return (messages.delete = "No brand selected.");
      
        try {
          await brandService.deleteBrand(selectedBrandId.value);
          (document.getElementById("deleteBrandModal") as HTMLDialogElement).close();
          loadBrand();
        } catch (err: AxiosError | any) {
            messages.delete = err.response.data.message;
        }
      };
      
      onMounted(loadBrand);

      return { resetBrandForm,selectedBrandId, brandSearch, brandDatas, filteredBrandDatas, messages, brandForm, loadBrand, saveBrand, deleteBrand };
}