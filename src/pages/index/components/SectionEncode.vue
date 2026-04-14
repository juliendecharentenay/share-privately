<template>
  <section
    id="encode"
    class="py-12 px-6 max-w-3xl mx-auto scroll-mt-14"
    :class="isActive ? 'bg-blue-50/40' : ''"
  >
    <h2 class="text-2xl font-bold text-slate-800 mb-2">3. Encode a Message</h2>
    <p class="text-slate-500 mb-6">
      Encrypt a message using the recipient's public key. Type the confidential text
      below and click <em>Encode</em>. The resulting URL contains the encrypted message
      &mdash; send it to the recipient.
    </p>

    <div v-if="!isActive" class="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-6 text-sm text-slate-500">
      No public key present. Navigate to this page using the <em>Encoding URL</em>
      shared by the intended recipient.
    </div>

    <div v-else class="rounded-lg border border-blue-200 bg-blue-50 p-3 mb-6 text-sm text-blue-700 font-medium">
      Public key loaded from URL &mdash; ready to encode.
    </div>

    <div class="space-y-4">
      <textarea
        v-model="plaintext"
        :disabled="!isActive"
        placeholder="Enter the confidential text to encode\u2026"
        rows="8"
        class="w-full border border-slate-300 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 resize-y"
      ></textarea>

      <button
        @click="encode"
        :disabled="!isActive || !plaintext.trim() || encoding"
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
        id="encode-button"
      >
        {{ encoding ? 'Encoding\u2026' : 'Encode' }}
      </button>

      <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        id="error-text">
        {{ error }}
      </div>

      <div v-if="encodedUrl" class="rounded-lg border border-green-300 bg-green-50 p-5 space-y-4">
        <p class="text-sm font-semibold text-green-800">
          Message encoded. Send this URL to the recipient:
        </p>
        <div
          class="bg-white border border-slate-200 rounded-lg p-3 text-xs break-all text-slate-700 font-mono select-all leading-relaxed"
        >
          {{ encodedUrl }}
        </div>
        <button
          @click="copyEncodedUrl"
          class="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          id="copy-encoded-url"
        >
          {{ copied ? 'Copied!' : 'Copy URL' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, inject, } from 'vue';

const crypto = inject("crypto");

const props = defineProps({
  publicKey: { type: String, default: '' },
  /* Dependency injection */
  clipboard: { type: Object, default: navigator.clipboard, },
});

const plaintext = ref('');
const encoding = ref(false);
const encodedUrl = ref('');
const error = ref('');
const copied = ref(false);

const isActive = computed(() => !!props.publicKey);

async function encode() {
  encoding.value = true;
  error.value = '';
  encodedUrl.value = '';
  try {
    const encrypted = await crypto.encryptText(plaintext.value, props.publicKey);
    encodedUrl.value = `${window.location.origin}${window.location.pathname}?ec=${encrypted}`;
  } catch (e) {
    error.value = `Encoding failed: ${e.message}`;
  } finally {
    encoding.value = false;
  }
}

async function copyEncodedUrl() {
  try {
    await props.clipboard.writeText(encodedUrl.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (e) {
    error.value = `Could not copy to clipboard: ${e.message}`;
  }
}
</script>
