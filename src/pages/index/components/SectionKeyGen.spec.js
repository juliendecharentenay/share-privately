import { describe, it, expect, vi, } from 'vitest';
import { mount, flushPromises, } from '@vue/test-utils';
import SectionKeyGen from './SectionKeyGen.vue';

describe("SectionKeyGen.vue", () => {
  it("Renders", async () => {
    const crypto = {
      generateKeyPair: vi.fn(() => Promise.resolve({publicKey: "abc", privateKeyPem: "123"})),
    };
    const clipboard = { writeText: vi.fn(() => Promise.resolve()), };
    const wrapper = mount(SectionKeyGen, {
      global: { provide: { crypto, } },
      props: { 
        location: {
          origin: 'http://localhost:8080',
          pathname: '/index.html',
        },
        clipboard,
      },
    });
    expect(wrapper.findAll('button').length).toBe(1);
    expect(wrapper.find('#error').exists()).toBe(false);

    await wrapper.find('#generate-key').trigger('click');
    await flushPromises();
    expect(wrapper.find('#error').exists()).toBe(false);
    expect(crypto.generateKeyPair.mock.calls.length).toBe(1);
    expect(wrapper.findAll('button').length).toBe(3);
    expect(wrapper.find('#public-key-url').text()).toContain("pk=abc");

    await wrapper.find('#copy-public-key-url').trigger('click');
    await flushPromises();
    expect(clipboard.writeText.mock.calls[0][0]).toContain("pk=abc");
  });

  it("Display an error on generate key error", async () => {
    const crypto = {
      generateKeyPair: vi.fn(() => Promise.reject(new Error("An error"))),
    };
    const clipboard = { writeText: vi.fn(() => Promise.resolve()), };
    const wrapper = mount(SectionKeyGen, {
      global: { provide: { crypto, } },
      props: { 
        location: {
          origin: 'http://localhost:8080',
          pathname: '/index.html',
        },
        clipboard,
      },
    });
    expect(wrapper.find('#error').exists()).toBe(false);

    await wrapper.find('#generate-key').trigger('click');
    await flushPromises();
    expect(wrapper.find('#error').exists()).toBe(true);
    expect(wrapper.find('#error').text()).toContain("An error");
  });

  it("Display an error on clipbard error", async () => {
    const crypto = {
      generateKeyPair: vi.fn(() => Promise.resolve({publicKey: "abc", privateKeyPem: "123"})),
    };
    const clipboard = { writeText: vi.fn(() => Promise.reject(new Error("An error"))), };
    const wrapper = mount(SectionKeyGen, {
      global: { provide: { crypto, } },
      props: { 
        location: {
          origin: 'http://localhost:8080',
          pathname: '/index.html',
        },
        clipboard,
      },
    });
    expect(wrapper.findAll('button').length).toBe(1);
    expect(wrapper.find('#error').exists()).toBe(false);

    await wrapper.find('#generate-key').trigger('click');
    await flushPromises();
    expect(wrapper.find('#error').exists()).toBe(false);

    await wrapper.find('#copy-public-key-url').trigger('click');
    await flushPromises();
    expect(wrapper.find('#error').exists()).toBe(true);
    expect(wrapper.find('#error').text()).toContain("An error");
  });

});
