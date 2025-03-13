import {createRouter, createWebHistory} from 'vue-router';
import Login from '../views/Login.vue'
import UserPanel from '../views/UserPanel.vue';
import Dashboard from '../views/Dashboard.vue';
import AdminUserManagement from '../views/admin/AdminUserManagement.vue';
import AdminSales from '../views/admin/AdminSales.vue';
import AdminProduct from '../views/admin/AdminProduct.vue';
import AdminSettings from '../views/admin/AdminSettings.vue';
import CashierSales from '../views/cashier/CashierSales.vue';
import CashierCustomers from '../views/cashier/CashierCustomers.vue';
import Settings from '../views/Settings.vue';
import StockProduct from '../views/stockman/StockProduct.vue';
import StockSupply from '../views/stockman/StockSupply.vue';
import NotFound from '../views/NotFound.vue';
const router = createRouter({
    history:createWebHistory(),
    routes: [
        { 
            path:'/admin', 
            component: UserPanel,
            children: [
                {
                    path: '/admin', 
                    component: Dashboard,
                    meta: { 
                        requiresAuth: true 
                    }},
                {path: '/admin/users', component: AdminUserManagement},
                {path: '/admin/products', component: AdminProduct},
                {path: '/admin/sales', component: AdminSales},
                {path: '/admin/settings', component: AdminSettings}
            ]
        }, 
        { 
            path:'/cashier', 
            component: UserPanel,
            children: [
                {
                    path: '/cashier', 
                    component: Dashboard,
                    meta: { 
                        requiresAuth: true 
                    }},
                {path: '/cashier/sales', component: CashierSales},
                {path: '/cashier/customers', component: CashierCustomers},
                {path: '/cashier/settings', component: Settings}
            ]
        },
        { 
            path:'/stockman', 
            component: UserPanel,
            children: [
                {
                    path: '/stockman', 
                    component: Dashboard,
                    meta: { 
                        requiresAuth: true 
                    }},
                {path: '/stockman/products', component: StockProduct},
                {path: '/stockman/supply', component: StockSupply},
                {path: '/stockman/settings', component: Settings}
            ]
        },
        { 
            path:'/', 
            component: Login
        },
        { path: '/:pathMatch(.*)*', component: NotFound },
    ]
})
export default router;