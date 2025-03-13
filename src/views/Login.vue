<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from 'vue-router';
import { getRole } from "../utils/authUtil.ts";
const username = ref("");
const password = ref("");
const message = ref("");
const router = useRouter();
//change domain
const login = async () => {
  if (username.value == "") return message.value = "Username cannot be empty."
  else if (password.value == "") return message.value = "Password cannot be empty."
  try {
    const res = await axios.post("http://localhost:3000/api/auth/login", {
      username: username.value,
      password: password.value
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      
      if (getRole() == "admin") router.push("/admin");
      else if (getRole() == "stockman") router.push("/stockman");
      else if (getRole() == "cashier") router.push("/cashier");

      message.value = "";
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      message.value = (err.response?.data?.message || "Server error");
    } else {
      message.value = "An unexpected error occurred.";
    }
  }
};

</script>

<template>
  <main class="login-container">
    <div class="login-form">
      <div class="login-title">Sign In to Your Dashboard</div>
      <form class="login-form-detail" @submit.prevent>
        <label for="username">Username</label>
        <input type="text" class="login-input" id="username" v-model="username">
        <label for="password">Password</label>
        <input type="password" class="login-input" id="password" v-model="password">
        <button @click="login" class="login-button">Login</button>
        <p class="self-center text-[#F00] font-[300] text-[13px] pt-2">{{ message }}</p>

      </form>
    </div>
  </main>
</template>

<style scoped>
.login-button {
  margin-top: 10px;
  align-self: center;
  color: #433;
  text-shadow: 0px 0px 0.9px #FFF;
  font-size: 15px;
  font-weight: 700;
  width: 221px;
  height: 42px;
  border-radius: 16px;
  background: #ffffff;
  border: 0px solid;
  box-shadow: 0px 3px 2.4px -1px rgba(0, 0, 0, 0.24);
  transition: all 300ms ease-in-out;
}

.login-button:hover,
.login-button:active {
  background-color: rgb(194, 181, 181)
}

.login-button:active {
  background-color: rgb(161, 133, 133);
}

.login-form-detail {
  padding: 0 50px 0 50px;
  display: flex;
  flex-direction: column;
}

.login-input {
  margin: 7px 0 20px 0;
  border-radius: 4px;
  border: 1px solid #D6D9DA;
  background: #352929;
  padding-left: 5px;
  color: white;
  height: 37px;
  width: 352px;
}

.login-form-detail>label {
  color: #2A353A;
  font-size: 15px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  font-variation-settings:
    "wdth" 75;
}

.login-container {
  display: flex;
  background-color: #684B4B;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.login-form {
  height: 371px;
  width: 452px;
  border-radius: 11px;
  border: 2px solid #FFF;
  background: #FBAB7E;
  box-shadow: 0px 0px 4.3px 4px rgba(0, 0, 0, 0.21) inset;
}

.login-title {
  padding: 35px 0 20px 0;
  color: #433;
  text-align: center;
  font-optical-sizing: auto;
  font-weight: 800;
  font-style: normal;
  font-size: 28px;
}

.hidden {
  display: hidden;
}
</style>