import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import type { Component } from 'vue';

import type { Paradigm } from '@/paradigm/domain/paradigm';
import { loadParadigm } from '@/paradigm/infrastructure/loadParadigm';
import { provideParadigm } from '@/paradigm/ui/composables/useParadigm';
import type { ParadigmState } from '@/paradigm/ui/composables/useParadigm';

/**
 * Mounts a component inside a host that provides the paradigm state, and
 * hands that state back so a test can drive it directly.
 *
 * Components read the state through `useParadigm()`, so mounting one alone
 * would throw; the host plays the role `App.vue` plays in production.
 *
 * @param component - the component under test
 * @param paradigm - the paradigm to provide; defaults to the one the build carries
 * @returns the mounted wrapper and the live state behind it
 */
export function mountWithParadigm(component: Component, paradigm: Paradigm = loadParadigm()) {
  let state!: ParadigmState;
  const host = defineComponent({
    setup() {
      state = provideParadigm(paradigm);
      return () => h(component);
    },
  });
  const wrapper = mount(host);
  return { wrapper, paradigm: state };
}
