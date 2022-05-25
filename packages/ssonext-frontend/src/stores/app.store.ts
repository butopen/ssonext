import { loggable, mergeable } from '../shared/store.util';
import { writable } from 'svelte/store';

const debugging = window.location.href.startsWith('http://localhost:3000');
export const app = loggable(
  mergeable({
    loading: false,
    debugging,
    fullScreenLoading: false
  })
);

export function setLoading(loading: boolean) {
  app.merge({ loading });
}

export function setFullScreenLoading(loading: boolean) {
  app.merge({ fullScreenLoading: loading });
}
