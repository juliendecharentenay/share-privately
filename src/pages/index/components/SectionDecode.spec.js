import { describe, it, expect, vi, } from 'vitest';
import { mount, flushPromises, } from '@vue/test-utils';
import { nextTick } from 'vue';
import SectionDecode from './SectionDecode.vue';

const pauseFor = ms => new Promise(resolve => setTimeout(resolve, ms));
async function addFile(wrapper) {
  const file = new File(['key text'], 'private-key.pem');
  const input = wrapper.find('input[type="file"]');
  Object.defineProperty(input.element, 'files', {
    value: [file], writable: false,
  });
  await input.trigger('change');
  await pauseFor(100); // Wait for file reading
}

describe("SectionDecode.vue", () => {
  it("Renders", async () => {
    const crypto = {
      decryptText: vi.fn(() => Promise.resolve("abc")),
    };
    const wrapper = mount(SectionDecode, {
      global: { provide: { crypto, }, },
      props: {
        encryptedContent: {v: 1},
      }
    });
    expect(wrapper.find('input').element.disabled).toBe(false);
    expect(wrapper.find('button').element.disabled).toBe(true);

    await addFile(wrapper);

    expect(wrapper.find('button').element.disabled).toBe(false);

    await wrapper.find('button').trigger('click');
    expect(crypto.decryptText.mock.calls.length).toBe(1);
    expect(crypto.decryptText.mock.calls[0][0].v).toBe(1);
  });

  it("Shown an error if decrypt fails", async () => {
    const crypt = {
      decryptText: () => Promise.reject(new Error("STOP")),
    };
    const wrapper = mount(SectionDecode, {
      global: { provide: { crypto, }, },
      props: {
        encryptedContent: {v: 1},
      }
    });
    expect(wrapper.find('#error-message').exists()).toBe(false);

    await addFile(wrapper);
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('#error-message').exists()).toBe(true);
  });

});
