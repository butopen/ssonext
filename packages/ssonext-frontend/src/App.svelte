<script lang="ts">
  import './index.scss';
  import AuthForm from './components/auth-form.svelte';
  import GettingStarted from './components/getting-started/getting-started.svelte';
  import PasswordReset from './components/password-reset.svelte';

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

<!--
<div class="mt-24 flex w-full justify-center md:items-center">
  <div class="max-w-screen-md md:w-1/3">
    <AuthForm />
  </div>
</div>
-->
{#if route('getting-started')}
  <GettingStarted />
{/if}
{#if route('password-reset')}
  <PasswordReset />
{/if}

<style lang="scss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
