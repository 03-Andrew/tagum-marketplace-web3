<script setup>
import { UserIcon, ArrowRightCircleIcon } from '@heroicons/vue/24/solid';
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { getUsername } from '../../utils/authUtil'
const router = useRouter();
const username = ref('');
function logout(){
    localStorage.removeItem("token");
    router.push("/");
}
</script>
<template>
    <div class="header">
        <div class="current-user"><p>Logged in as</p><p>{{getUsername()}}</p></div>
        <div class="account-op">
           <arrow-right-circle-icon class="icon" @click="logout()"/>
        </div>
    </div>
</template>

<style scoped>
.icon{
    color:#f7f0f0;
    padding-left:15px;
    height: 20px;
}

.icon:hover{
    color: #ac9696;
    cursor:pointer;
}
.account-op{
    align-items: center;
    margin: 0 18px 0 20px;
    height:70%;
    border-left: 1px solid rgba(71, 57, 57, 0.57);
    display: inline-flex;
}
.current-user{
    display: inline-flex;
    text-wrap:nowrap;
    color: #faf4f4;
    font-size: 14px;
}
.current-user > p:nth-of-type(1){
    font-weight: 300;
}

.current-user > p:nth-of-type(2){
    margin-left:4px;
    font-weight: 600;
}

.header{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height:60px;
}
</style>