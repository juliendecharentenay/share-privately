<template>
  <section id="keygen" class="py-12 px-6 max-w-3xl mx-auto scroll-mt-14">
    <h2 class="text-2xl font-bold text-slate-800 mb-2">2. Key Generation</h2>
    <p class="text-slate-500 mb-6">
      Generate your personal key pair. Save the private key file locally — you will need
      it later to decode messages. Share the <em>Encoding URL</em> with anyone who wants
      to send you a confidential message.
    </p>

    <div class="space-y-5">
      <button
        @click="generate"
        :disabled="generating"
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
        id="generate-key"
      >
        {{ generating ? 'Generating\u2026' : 'Generate Key Pair' }}
      </button>

      <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" id="error">
        {{ error }}
      </div>

      <div v-if="publicKey" class="space-y-4">
        <div class="rounded-lg border border-green-300 bg-green-50 p-5 space-y-4">
          <p class="text-sm font-semibold text-green-800">Key pair generated successfully.</p>

          <div class="flex flex-wrap gap-3">
            <button
              @click="downloadPrivateKey"
              class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              id="download-private-key"
            >
              Download Private Key
            </button>
            <button
              @click="copyPublicKeyUrl"
              class="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              id="copy-public-key-url"
            >
              {{ copied ? 'Copied!' : 'Copy Encoding URL' }}
            </button>
          </div>

          <div>
            <p class="text-xs font-medium text-slate-500 mb-1">
              Encoding URL &mdash; share this with the person who will send you a message:
            </p>
            <div
              class="bg-white border border-slate-200 rounded-lg p-3 text-xs break-all text-slate-700 font-mono select-all leading-relaxed"
              id="public-key-url"
            >
              {{ publicKeyUrl }}
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Important:</strong> Download and save your private key file now.
          It cannot be recovered if lost. Do not share it with anyone &mdash;
          it is required to decode messages sent to you.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
const props = defineProps({
  /* Dependency injection */
  location: { type: Object, default: window.location, },
  clipboard: { type: Object, default: navigator.clipboard, },
});

const crypto = inject("crypto");

const generating = ref(false);
const publicKey = ref('');
const privateKeyPem = ref('');
const copied = ref(false);
const error = ref('');

const publicKeyUrl = computed(() => {
  if (!publicKey.value) return '';
  return `${window.location.origin}${window.location.pathname}?pk=${publicKey.value}`;
});

async function generate() {
  generating.value = true;
  error.value = '';
  publicKey.value = '';
  privateKeyPem.value = '';
  try {
    const result = await crypto.generateKeyPair();
    publicKey.value = result.publicKey;
    privateKeyPem.value = result.privateKeyPem;
  } catch (e) {
    error.value = `Key generation failed: ${e.message}`;
  } finally {
    generating.value = false;
  }
}

function downloadPrivateKey() {
  const blob = new Blob([privateKeyPem.value], { type: 'application/x-pem-file' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'private-key.pem';
  a.click();
  URL.revokeObjectURL(url);
}

async function copyPublicKeyUrl() {
  try {
    await props.clipboard.writeText(publicKeyUrl.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (e) {
    error.value = `Could not copy to clipboard: ${e.message}`;
  }
}
</script>
