<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { queryParams } from '../shared/url-params.service';
  import { login, resetPassword } from '../services/api.service';
  import { jwtDecode } from '../shared/jwt-decode.service';
  import { loggable, mergeable } from '../shared/store.util';
  import { loginAndMoveToHome } from '../services/app.service';

  const dispatch = createEventDispatcher();

  const params = queryParams<{ reset: string }>();

  const store = loggable(
    mergeable({
      token: params.reset,
      password: '',
      confirmedPassword: '',
      passwordEmpty: false,
      passwordDoNotMatch: false
    })
  );

  async function onResetPassword() {
    $store.passwordEmpty = false;
    if (!$store.password) {
      $store.passwordEmpty = true;
    } else if ($store.password != $store.confirmedPassword) {
      $store.passwordDoNotMatch = true;
    } else {
      const result = await resetPassword($store.password, $store.token);
      if (result.ok) {
        const { email, tenant } = jwtDecode($store.token);
        try {
          await loginAndMoveToHome(email, $store.password, tenant);
        } catch {}
      }
    }
  }
</script>

<div class="password-reset sso-section mt-8">
  <h1>Reset your password</h1>
  <p>Please choose a new password below</p>
  <input
    type="password"
    name="password"
    class="bo-input mt-2"
    placeholder="Password"
    bind:value={$store.password} />
  <input
    type="password"
    name="confirmedPassword"
    class="bo-input mt-2"
    placeholder="Confirm your password"
    bind:value={$store.confirmedPassword} />
  <button
    class="bo-button mt-2"
    class:disabled={!$store.password || $store.password != $store.confirmedPassword}
    on:click={onResetPassword}>
    Reset password
  </button>

  {#if $store.passwordEmpty}
    <div class="bo-box-error">* Please specify a password</div>
  {/if}
  {#if $store.passwordDoNotMatch}
    <div class="bo-box-error">* Password should match</div>
  {/if}
</div>

<style lang="scss">
  .password-reset {
    @apply mx-auto block;
    max-width: 560px;
  }
</style>
