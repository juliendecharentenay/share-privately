<template>
  <section
    id="decode"
    class="py-12 px-6 max-w-3xl mx-auto scroll-mt-14"
    :class="isActive ? 'bg-green-50/40' : ''"
  >
    <h2 class="text-2xl font-bold text-slate-800 mb-2">4. Decode a Message</h2>
    <p class="text-slate-500 mb-6">
      Upload your saved private key file and click <em>Decode</em> to read the
      encrypted message.
    </p>

    <div v-if="!isActive" class="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-6 text-sm text-slate-500">
      No encoded message present. Navigate to this page using the URL shared by
      the sender.
    </div>

    <div v-else class="rounded-lg border border-green-200 bg-green-50 p-3 mb-6 text-sm text-green-700 font-medium">
      Encoded message loaded from URL &mdash; upload your private key to decode.
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          Private Key File <span class="text-slate-400 font-normal">(.pem)</span>
        </label>
        <input
          type="file"
          accept=".pem"
          @change="onFileChange"
          :disabled="!isActive"
          class="block w-full text-sm text-slate-600
            file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
            file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700
            hover:file:bg-slate-200 file:cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <button
        @click="decode"
        :disabled="!isActive || !privateKeyPem || decoding"
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        {{ decoding ? 'Decoding\u2026' : 'Decode' }}
      </button>

      <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        id="error-message">
        {{ error }}
      </div>

      <div v-if="plaintext" class="rounded-lg border border-green-300 bg-green-50 p-5 space-y-3">
        <p class="text-sm font-semibold text-green-800">Decoded message:</p>
        <pre class="whitespace-pre-wrap text-sm text-slate-800 bg-white border border-slate-200 rounded-lg p-4 font-mono leading-relaxed overflow-x-auto">{{ plaintext }}</pre>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, inject, } from 'vue';

const crypto = inject("crypto");

const props = defineProps({
  encryptedContent: { type: Object, default: null },
});

const privateKeyPem = ref('');
const decoding = ref(false);
const plaintext = ref('');
const error = ref('');

const isActive = computed(() => !!props.encryptedContent);

function onFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    privateKeyPem.value = e.target.result;
  };
  reader.readAsText(file);
}

async function decode() {
  decoding.value = true;
  error.value = '';
  plaintext.value = '';
  try {
    plaintext.value = await crypto.decryptText(props.encryptedContent, privateKeyPem.value);
  } catch (e) {
    error.value = `Decoding failed: ${e.message}. Make sure you are using the correct private key.`;
  } finally {
    decoding.value = false;
  }
}
</script>
