<script lang="ts">
  import './index.scss';
  import AuthForm from './components/auth-form.svelte';
  import GettingStarted from './components/getting-started/getting-started.svelte';
  import Dashboard from './components/dashboard.svelte';
  import PasswordReset from './components/password-reset.svelte';
  import Notification from './components/notification/notification.svelte';
  import { app } from './stores/app.store';

  function route(path: string) {
    return window.location.href.indexOf(path) >= 0;
  }

  let hasCode = false;
  let code = '';
  try {
    const match = /app\/t\/(\w+)/.exec(window.location.href);
    code = match[1];
    hasCode = true;
  } catch {}
</script>

{#if $app.loading}
  <div class="top-loading" />
{/if}

{#if $app.fullScreenLoading}
  <div class="bo-loading-full-screen" />
{/if}

{#if route('dashboard')}
  <Dashboard />
{/if}

{#if route('login')}
  <AuthForm />
{/if}

{#if route('getting-started')}
  <GettingStarted />
{/if}
{#if route('password-reset')}
  <PasswordReset />
{/if}

<Notification />

<style lang="scss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
