import { describe, it, expect, vi, } from 'vitest';
import { mount, } from '@vue/test-utils';
import SectionEncode from './SectionEncode.vue';

describe("SectionEncode.vue", () => {
  it("Renders", async () => {
    const crypto = {
      encryptText: vi.fn(() => Promise.resolve("abc")),
    };
    const clipboard = {
      writeText: vi.fn(() => Promise.resolve()),
    };
    const wrapper = mount(SectionEncode, {
      global: { provide: { crypto, } },
      props: { clipboard, publicKey: "123", },
    });
    const textarea = wrapper.find('textarea');
    const encode_button = wrapper.find('#encode-button');

    expect(textarea.element.disabled).toBe(false);
    expect(encode_button.element.disabled).toBe(true);

    textarea.setValue('hello');
    await textarea.trigger('input');
    expect(encode_button.element.disabled).toBe(false);

    await encode_button.trigger('click');
    expect(crypto.encryptText.mock.calls[0][0]).toBe('hello');
    expect(crypto.encryptText.mock.calls[0][1]).toBe('123');

    await wrapper.find('#copy-encoded-url').trigger('click');
    expect(clipboard.writeText.mock.calls[0][0]).toContain("ec=abc");
  });

  it("Shows an error if crypto fails", async () => {
    const crypto = {
      encryptText: () => Promise.reject(new Error("STOP")),
    };
    const clipboard = {
      writeText: () => Promise.resolve(),
    };
    const wrapper = mount(SectionEncode, {
      global: { provide: { crypto, } },
      props: { clipboard, publicKey: "123", },
    });
    expect(wrapper.find('#error-text').exists()).toBe(false);

    const textarea = wrapper.find('textarea');
    textarea.setValue('hello');
    await textarea.trigger('input');
    await wrapper.find('#encode-button').trigger('click');
    expect(wrapper.find('#error-text').exists()).toBe(true);
  });

  it("Shows an error if clipboard fails", async () => {
    const crypto = {
      encryptText: () => Promise.resolve("abc"),
    };
    const clipboard = {
      writeText: () => Promise.reject(new Error("STOP")),
    };
    const wrapper = mount(SectionEncode, {
      global: { provide: { crypto, } },
      props: { clipboard, publicKey: "123", },
    });
    expect(wrapper.find('#error-text').exists()).toBe(false);

    const textarea = wrapper.find('textarea');
    textarea.setValue('hello');
    await textarea.trigger('input');
    await wrapper.find('#encode-button').trigger('click');
    await wrapper.find('#copy-encoded-url').trigger('click');
    expect(wrapper.find('#error-text').exists()).toBe(true);
  });
});
