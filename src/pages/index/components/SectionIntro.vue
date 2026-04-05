<template>
  <section id="intro" class="py-12 px-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold text-slate-800 mb-4">1. Introduction</h2>

    <div class="space-y-6 text-slate-600">
      <p>
        <strong class="text-slate-800">Private Share</strong> lets you securely share confidential text
        with another person over an untrusted channel (email, chat, etc.) using
        <em>asymmetric encryption</em>. No account or server is involved — everything
        happens inside your browser.
      </p>

      <div>
        <h3 class="text-lg font-semibold text-slate-700 mb-2">How it works</h3>
        <ol class="list-decimal list-inside space-y-2">
          <li>
            <strong>Recipient (User 1)</strong> goes to
            <a href="#keygen" class="text-blue-600 hover:underline">Section 2</a>,
            generates a key pair, saves the private key file locally, and sends
            the <em>Encoding URL</em> (containing the public key) to the sender.
          </li>
          <li>
            <strong>Sender (User 2)</strong> follows that URL to
            <a href="#encode" class="text-blue-600 hover:underline">Section 3</a>,
            types the confidential text, clicks <em>Encode</em>, and sends the
            resulting encoded URL back to the recipient.
          </li>
          <li>
            <strong>Recipient (User 1)</strong> follows the encoded URL to
            <a href="#decode" class="text-blue-600 hover:underline">Section 4</a>,
            uploads the saved private key file, and clicks <em>Decode</em> to
            read the message.
          </li>
        </ol>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-slate-700 mb-2">Security model</h3>
        <ul class="list-disc list-inside space-y-1.5">
          <li>
            Encryption uses <strong>RSA-OAEP 4096-bit</strong> to protect an ephemeral
            <strong>AES-GCM 256-bit</strong> key (hybrid encryption), implemented entirely
            via the browser's built-in
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto"
              target="_blank"
              rel="noopener"
              class="text-blue-600 hover:underline"
            >Web Crypto API</a>.
          </li>
          <li>
            All cryptographic operations run <strong>locally in your browser</strong>.
            No data is ever transmitted to a server.
          </li>
          <li>
            The public key and encrypted content travel as URL query parameters.
            URLs may appear in browser history, server access logs, or link-preview
            services — keep this in mind for highly sensitive content.
          </li>
          <li>
            Your private key never leaves your device unless you share the file yourself.
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-slate-700 mb-2">Limitations</h3>
        <ul class="list-disc list-inside space-y-1.5">
          <li>Text content only — no file attachments.</li>
          <li>
            The encoded URL grows with the length of the text. Very large messages
            may exceed URL length limits in some messaging platforms (~2 000 characters
            is a safe upper bound for compatibility).
          </li>
          <li>
            The private key file must be kept safe. If it is lost, encoded messages
            cannot be decrypted.
          </li>
          <li>
            This tool provides confidentiality, not authenticity. The recipient cannot
            verify who encoded the message.
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
