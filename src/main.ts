import { createApp } from "vue";
import App from "./App.vue";
import NavBar from  './views/components/NavBar.vue';
import Headers from  './views/components/Heading.vue';
import router from  './router/index.ts';
import VueApexCharts from "vue3-apexcharts";
//Widgets
import SupplierWidget from "./views/components/widgets/SupplierWidget.vue";
import BrandWidget from "./views/components/widgets/BrandWidget.vue";
import ProductWidget from "./views/components/widgets/ProductWidget.vue";
import ProductVariantWidget from "./views/components/widgets/ProductVariantWidget.vue";
import SupplyWidget from "./views/components/widgets/SupplyWidget.vue";
import CustomerWidget from "./views/components/widgets/CustomerWidget.vue";
import SalesWidget from "./views/components/widgets/SalesWidget.vue";
import UserWidget from "./views/components/widgets/UserWidget.vue";
import RemarkWidget from "./views/components/widgets/RemarkWidget.vue";
import AccountSettingsWidget from "./views/components/widgets/AccountSettingsWidget.vue";
import { getPayload, getRole } from "./utils/authUtil.ts";

//Mini widgets
import TotalEarningWidget from "./views/components/widgets/visuals/TotalEarningWidget.vue";
import NumberSalesWidget from "./views/components/widgets/visuals/NumberSalesWidget.vue";
import TotalProductsWidget from "./views/components/widgets/visuals/TotalProductsWidget.vue";
import TotalCustomersWidget from "./views/components/widgets/visuals/TotalCustomersWidget.vue";
import SalesTrendsWidget from "./views/components/widgets/visuals/SalesTrendsWidget.vue";

const app = createApp(App);
//lock employeeId to jaja
router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem("token") || "";
    if (token) {
        try {
            const payload = getPayload();
            if (payload.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                next('/'); 
            } else {
                if(getRole()=="admin" && to.fullPath=="/"){
                    next('/admin');
                } else if(getRole()=="stockman" && to.fullPath=="/"){
                    next('/stockman');
                } else if(getRole()=="cashier" && to.fullPath=="/"){
                    next('/cashier');
                } else next();
            }
        } catch (err) {
            localStorage.removeItem("token");
            next('/'); 
        }
    } else {
        if (to.meta.requiresAuth) {
            next('/');
        } else {
            next();
        }
    }
});

app.use(router);
app.use(VueApexCharts);

app.component('navbar',NavBar);
app.component('headers',Headers);
//widgets
app.component('sales-widget',SalesWidget);
app.component('supplier-widget',SupplierWidget);
app.component('brand-widget',BrandWidget);
app.component('product-widget',ProductWidget);
app.component('product-variant-widget',ProductVariantWidget);
app.component('supply-widget',SupplyWidget);
app.component('customer-widget',CustomerWidget);
app.component('user-widget',UserWidget);
app.component('remark-widget',RemarkWidget);
app.component('account-settings-widget',AccountSettingsWidget);

//mini widgets
app.component('total-earning-widget',TotalEarningWidget);
app.component('number-sales-widget',NumberSalesWidget);
app.component('total-products-widget',TotalProductsWidget);
app.component('total-customers-widget',TotalCustomersWidget);
app.component('sales-trends-widget',SalesTrendsWidget);
app.mount("#app");
