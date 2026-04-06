<script setup lang="ts">
const { login } = useAuth();
const props = defineProps<{ show: boolean }>();
const emit = defineEmits(["close"]);

const email = ref("admin@baninanaf.com");
const password = ref("");
const errorMsg = ref("");
const isSubmitting = ref(false);

const handleLogin = async () => {
  if (!password.value) {
    errorMsg.value = "Password tidak boleh kosong!";
    return;
  }

  errorMsg.value = "";
  isSubmitting.value = true;
  try {
    await login(email.value, password.value);
    password.value = "";
    emit("close");
  } catch (err: any) {
    errorMsg.value = "Password yang Anda masukkan salah!";
  } finally {
    isSubmitting.value = false;
  }
};

watch(
  () => props.show,
  (val) => {
    if (!val) {
      errorMsg.value = "";
      password.value = "";
    }
  }
);
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
  >
    <div
      class="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300"
    >
      <div class="text-center mb-8">
        <h3
          class="text-2xl font-black text-slate-900 uppercase italic leading-none"
        >
          Admin Login
        </h3>
        <p
          class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3"
        >
          Akses Khusus Pengelola Nasab
        </p>
      </div>

      <div
        class="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-emerald-500 shrink-0 mt-0.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="space-y-1">
          <p
            class="text-[10px] font-black uppercase text-emerald-700 tracking-wider leading-none"
          >
            Login Sebagai:
          </p>
          <p class="text-xs font-bold text-emerald-600/80 truncate">
            admin@*****.com
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="relative">
          <label
            class="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-[0.2em]"
            >Masukkan Password</label
          >
          <input
            v-model="password"
            type="password"
            @keyup.enter="handleLogin"
            placeholder="••••••••"
            class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-center text-lg font-black outline-none focus:border-emerald-500 focus:bg-white transition-all tracking-[0.3em]"
            autofocus
          />
        </div>
      </div>

      <transition name="fade">
        <p
          v-if="errorMsg"
          class="text-red-500 text-[10px] font-black uppercase italic mt-4 text-center animate-bounce"
        >
          ⚠️ {{ errorMsg }}
        </p>
      </transition>

      <div class="flex flex-col gap-3 mt-8">
        <button
          @click="handleLogin"
          :disabled="isSubmitting"
          class="w-full py-4 bg-slate-900 text-emerald-400 rounded-2xl text-xs font-black uppercase shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all"
        >
          {{ isSubmitting ? "Mohon tunggu..." : "Masuk Sekarang" }}
        </button>
        <button
          @click="emit('close')"
          :disabled="isSubmitting"
          class="w-full py-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600"
        >
          Batalkan
        </button>
      </div>
    </div>
  </div>
</template>
