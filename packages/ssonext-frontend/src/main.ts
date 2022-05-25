import './index.scss';
import App from './App.svelte';
import { loggable } from './shared/store.util';

loggable.enabled = true;

const app = new App({
  target: document.getElementById('app')
});

export default app;
