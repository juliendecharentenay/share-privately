import { describe, it, expect, } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import App from "./App.vue";

describe("App.vue", () => {
  it("Renders", async () => {
    const wrapper = mount(App, {
      props: {
        location: { search: '' },
      },
    });
    await nextTick();
    expect(wrapper.findComponent({name: 'SectionEncode'}).props()['publicKey']).toBe('');
    expect(wrapper.findComponent({name: 'SectionDecode'}).props()['encryptedContent']).toBe(null);
  });

  it("Renders at encoding section", async () => {
    const wrapper = mount(App, {
      props: {
        location: { search: 'pk=abc' },
      },
    });
    await nextTick();
    expect(wrapper.findComponent({name: 'SectionEncode'}).props()['publicKey']).toBe('abc');
    expect(wrapper.findComponent({name: 'SectionDecode'}).props()['encryptedContent']).toBe(null);
  });

  it("Renders at decoding section", async () => {
    const wrapper = mount(App, {
      props: {
        location: { search: 'ec=abc&ek=def&iv=ghi' },
      },
    });
    await nextTick();
    expect(wrapper.findComponent({name: 'SectionEncode'}).props()['publicKey']).toBe('');
    expect(wrapper.findComponent({name: 'SectionDecode'}).props()['encryptedContent']['ec']).toBe('abc');
    expect(wrapper.findComponent({name: 'SectionDecode'}).props()['encryptedContent']['ek']).toBe('def');
    expect(wrapper.findComponent({name: 'SectionDecode'}).props()['encryptedContent']['iv']).toBe('ghi');
  });

  it("Renders an incomplete decoding section", async () => {
    const wrapper = mount(App, {
      props: {
        location: { search: 'ec=abc&ek=def' },
      },
    });
    await nextTick();
    expect(wrapper.findComponent({name: 'SectionEncode'}).props()['publicKey']).toBe('');
    expect(wrapper.findComponent({name: 'SectionDecode'}).props()['encryptedContent']).toBe(null);
  });
});

