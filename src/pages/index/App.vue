<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-slate-900 text-white py-8 px-6">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold tracking-tight">Private Share</h1>
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
      <SectionDecode :encrypted-content="encryptedContent" />
    </main>

    <footer class="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
      All cryptographic operations run locally in your browser. Nothing is sent to any server.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import SectionIntro from './components/SectionIntro.vue';
import SectionKeyGen from './components/SectionKeyGen.vue';
import SectionEncode from './components/SectionEncode.vue';
import SectionDecode from './components/SectionDecode.vue';

const publicKey = ref('');
const encryptedContent = ref('');

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  publicKey.value = params.get('pk') || '';
  encryptedContent.value = params.get('ec') || '';

  if (publicKey.value || encryptedContent.value) {
    await nextTick();
    const targetId = publicKey.value ? 'encode' : 'decode';
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  }
});
</script>
