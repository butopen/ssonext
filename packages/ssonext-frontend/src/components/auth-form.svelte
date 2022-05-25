<script lang="ts">
  import { messagesStore } from '../stores/messages.store';
  import { _if } from '../shared/if.svelte-action';
  import { useForm, required, validators, email, Hint } from 'svelte-use-form';
  import { loggable, mergeable } from '../shared/store.util';

  import { loginAndMoveToHome } from '../services/app.service';
  import { queryParams } from '../shared/url-params.service';
  import { showNotification } from './notification/notification.store';
  import { forgotPassword } from '../services/api.service';
  import RegisterForm from './register-form.svelte';

  const params = queryParams<{ tenant: string }>();

  let activeTabIndex = 0;
  const form = useForm();

  const s = loggable(
    mergeable({
      email: '',
      password: '',
      tenant: params.tenant,
      error: false,
      loading: false,
      showForgotPasswordPopup: false
    })
  );

  async function login() {
    try {
      await loginAndMoveToHome($s.email, $s.password, params.tenant);
    } catch {
      $s.error = true;
    }
  }

  function onForgotPassword() {
    $s.showForgotPasswordPopup = true;
  }

  function onForgotClick() {
    $s.showForgotPasswordPopup = false;
    forgotPassword($s.email, $s.tenant);
    showNotification('Please check you email to reset your password');
  }
</script>

<div class="auth-form-container">
  <div class="bo-tabs" tabIndex={activeTabIndex}>
    <div
      class="bo-tab"
      on:click={() => (activeTabIndex = 0)}
      class:active={activeTabIndex == 0}>
      {$messagesStore.authForm.tabs.login}
    </div>
    <div
      class="bo-tab"
      on:click={() => (activeTabIndex = 1)}
      class:active={activeTabIndex == 1}>
      {$messagesStore.authForm.tabs.register}
    </div>
  </div>

  <div use:_if={activeTabIndex == 0} class="p-4">
    <form use:form>
      <label>E-mail</label>
      <input
        bind:value={$s.email}
        type="email"
        name="email"
        use:validators={[email, required]} />
      <Hint for="email" on="required">
        <span class="form-error">E-mail is required</span>
      </Hint>
      <Hint for="email" on="email">
        <span class="form-error">Please provide a valid email</span>
      </Hint>

      <label>Password</label>
      <input
        bind:value={$s.password}
        type="password"
        name="password"
        use:validators={[required]} />
      <Hint for="password" on="required">
        <span class="form-error">Password is required</span>
      </Hint>
      <small>
        <a class="my-4 text-sm" on:click={onForgotPassword}>Forgot password?</a>
      </small>
    </form>
    <div class="mt-4 flex justify-end">
      <button
        on:click={login}
        class="bo-button"
        class:disabled={$s.loading || !$form.valid}
        type="button">
        Login
      </button>
    </div>
    <div use:_if={$s.error}>
      <span class="form-error">
        Could not login with these credentials. If you forgot your password, <a
          on:click={onForgotPassword}>
          reset it
        </a>
        .
      </span>
    </div>

    <div class="my-4 block text-sm">
      <span class="text-gray-400">{$messagesStore.authForm.login.noAccountLabel}</span>
      <a on:click={() => (activeTabIndex = 1)}>
        {$messagesStore.authForm.login.noAccountLink}
      </a>
    </div>
  </div>
  <div use:_if={activeTabIndex == 1}>
    <div class="mt-2">
      <RegisterForm />
    </div>
    <div class="my-4 block text-sm">
      <span class="text-gray-400">
        {$messagesStore.authForm.register.alreadyHaveAccountLabel}
      </span>
      <a on:click={() => (activeTabIndex = 0)}>
        {$messagesStore.authForm.register.alreadyHaveAccountLink}
      </a>
    </div>
  </div>
</div>

<div use:_if={$s.showForgotPasswordPopup} class="bo-popup">
  <div class="bo-popup-content" style="max-width: 400px">
    <div class="bo-popup-close" on:click={(e) => ($s.showForgotPasswordPopup = false)} />
    <div class="p-4">
      <h2>Reset password</h2>
      <span class="text-gray-400">
        Please specify your e-mail below to receive a link and reset your password:
      </span>

      <input type="email" bind:value={$s.email} />

      <div class="mt-4 flex justify-end">
        <button
          on:click={onForgotClick}
          class="bo-button"
          class:disabled={$s.loading || !$form.valid}
          type="button">
          Reset Password
        </button>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .auth-form-container {
    @apply mx-auto mt-12 p-4;
    min-height: 560px;
    max-width: 360px;
  }
</style>
