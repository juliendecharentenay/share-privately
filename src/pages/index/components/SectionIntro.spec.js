import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SectionIntro from './SectionIntro.vue';

describe('SectionIntro.vue', () => {
  it("Renders", () => {
    const wrapper = mount(SectionIntro);
    expect(wrapper.text()).toContain("Introduction");
  });
});

