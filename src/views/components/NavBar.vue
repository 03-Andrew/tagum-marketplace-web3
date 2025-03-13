<script setup>
import { ChartBarSquareIcon, UsersIcon, Cog8ToothIcon, ArchiveBoxArrowDownIcon } from '@heroicons/vue/24/solid';
import { ref } from 'vue'
import { getRole } from '../../utils/authUtil';
import logo from '../../assets/logo.png'
const currentPage = ref('dashboard'); 
const role = ref(getRole());
function changePage(page){
    currentPage.value = page; 
}
</script>

<template>
    <div class="navbar">
        <div class="pt-5 h-[91px] mb-8">
            <img class=" h-[91px]" :src="logo" alt="logo">
        </div>
        <div class="nav-title mr-20 font-bold text-sm pb-2">MAIN MENU</div>

        <template v-if="role === 'admin'">
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='dashboard'}">
                <router-link @click="changePage('dashboard')" class="nav-item-title" to="/admin"><chart-bar-square-icon class="icon"/>Dashboard</router-link>
            </div>
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='users'}">
                <router-link @click="changePage('users')" class="nav-item-title" to="/admin/users"><users-icon class="icon"/>User Management</router-link>
            </div>
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='product'}">
                <router-link @click="changePage('product')" class="nav-item-title" to="/admin/products"><archive-box-arrow-down-icon class="icon"/>Product & Inventory</router-link>
            </div>
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='sales'}">
                <router-link @click="changePage('sales')" class="nav-item-title" to="/admin/sales"><chart-bar-square-icon class="icon"/>Sales & Orders</router-link>
            </div>
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='settings'}">
                <router-link @click="changePage('settings')" class="nav-item-title" to="/admin/settings"><cog8-tooth-icon class="icon"/>Settings</router-link>
            </div>
        </template>

        <template v-else-if="role === 'cashier'">
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='dashboard'}">
                <router-link @click="changePage('dashboard')" class="nav-item-title" to="/cashier"><chart-bar-square-icon class="icon"/>Dashboard</router-link>
            </div>
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='sales'}">
                <router-link @click="changePage('sales')" class="nav-item-title" to="/cashier/sales"><chart-bar-square-icon class="icon"/>Sales</router-link>
            </div>
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='customers'}">
                <router-link @click="changePage('customers')" class="nav-item-title" to="/cashier/customers"><users-icon class="icon"/>Customers</router-link>
            </div>
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='settings'}">
                <router-link @click="changePage('settings')" class="nav-item-title" to="/cashier/settings"><cog8-tooth-icon class="icon"/>Settings</router-link>
            </div>
        </template>

        <template v-else-if="role === 'stockman'">
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='dashboard'}">
                <router-link @click="changePage('dashboard')" class="nav-item-title" to="/stockman"><chart-bar-square-icon class="icon"/>Dashboard</router-link>
            </div>
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='supply'}">
                <router-link @click="changePage('supply')" class="nav-item-title" to="/stockman/supply"><archive-box-arrow-down-icon class="icon"/>Supply</router-link>
            </div>
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='product'}">
                <router-link @click="changePage('product')" class="nav-item-title" to="/stockman/products"><chart-bar-square-icon class="icon"/>Product</router-link>
            </div>
            <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='settings'}">
                <router-link @click="changePage('settings')" class="nav-item-title" to="/stockman/settings"><cog8-tooth-icon class="icon"/>Settings</router-link>
            </div>
        </template>
    </div>
</template>

<style scoped>

.icon{
    margin-right:16px;
    width: 16px;
    height: 16px;
}
.navbar{
    overflow:hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    height:100%;
    width:220px;
    box-sizing: border-box;
}

.navbar::-webkit-scrollbar {
  display: none;
}

.nav-item-selected {
    box-sizing: border-box;
    border-radius: 15px 0px 0px 15px;
    border-right: 3px solid #FFAD68;
    background: #3F2E2E;
}

.nav-item:not(.nav-item-selected):hover{
    box-sizing: border-box;
    border-radius: 15px 0px 0px 15px;
    background: #5f4444;
}

.nav-item {
    flex-shrink: 0;
    margin:0;
    width:190px;
    height:45px;
    align-self: self-end;
    align-content: center;
    margin-bottom:7px;
    transition: all 100ms ease-in-out;
}
.nav-item-title {
    padding:14px 0 0 20px;
    height:100%;
    width:100%;
    display: inline-flex;
    text-decoration: none;
    color: #F1E6E6;
    font-size: 14px;
    font-weight: 400;
}

.nav-title {
    color:rgba(255, 255, 255, 0.61);
}
</style>