<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-slate-900 text-white py-8 px-6">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold tracking-tight">Share Privately</h1>
        <p class="text-slate-400 text-sm mt-1">
          End-to-end encrypted message sharing &mdash; no server, no account
        </p>
      </div>
    </header>

    <!-- Sticky nav -->
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div class="max-w-3xl mx-auto px-6 py-3 flex gap-6 text-sm font-medium overflow-x-auto">
        <a href="#intro"  class="text-slate-600 hover:text-blue-600 whitespace-nowrap transition-colors">1. Introduction</a>
        <a href="#keygen" class="text-slate-600 hover:text-blue-600 whitespace-nowrap transition-colors">2. Key Generation</a>
        <a href="#encode" class="text-slate-600 hover:text-blue-600 whitespace-nowrap transition-colors">3. Encode</a>
        <a href="#decode" class="text-slate-600 hover:text-blue-600 whitespace-nowrap transition-colors">4. Decode</a>
      </div>
    </nav>

    <!-- Sections -->
    <main class="divide-y divide-slate-100">
      <SectionIntro />
      <SectionKeyGen />
      <SectionEncode :public-key="publicKey" />
      <SectionDecode :encryptedContent="encryptedContent" />
    </main>

    <footer class="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
      All cryptographic operations run locally in your browser. Nothing is sent to any server.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, provide, } from 'vue';
import SectionIntro from './components/SectionIntro.vue';
import SectionKeyGen from './components/SectionKeyGen.vue';
import SectionEncode from './components/SectionEncode.vue';
import SectionDecode from './components/SectionDecode.vue';
import * as crypto from './crypto.js';

const props = defineProps({
  /* Dependency injection */
  location: { type: Object, default: window.location, },
  crypto: { type: Object, default: crypto, },
});
provide('crypto', props.crypto);

const publicKey = ref('');
const ec = ref('');
const ek = ref('');
const iv = ref('');
const encryptedContent = computed(() => {
  if (ec.value && ek.value && iv.value) {
    return { ec: ec.value, ek: ek.value, iv: iv.value };
  } else {
    return null;
  }
});

onMounted(async () => {
  const params = new URLSearchParams(props.location.search);
  publicKey.value = params.get('pk') || '';
  ec.value = params.get('ec') || '';
  ek.value = params.get('ek') || '';
  iv.value = params.get('iv') || '';

  if (publicKey.value || encryptedContent.value) {
    await nextTick();
    const targetId = publicKey.value ? 'encode' : 'decode';
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  }
});
</script>
