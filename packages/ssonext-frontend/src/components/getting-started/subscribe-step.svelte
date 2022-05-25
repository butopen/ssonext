<script lang="ts">
  import { fade } from 'svelte/transition';
  import { forgotPassword, subscribeTenant } from '../../services/api.service';
  import { _if } from '../../shared/if.svelte-action';
  import { loggable, mergeable } from '../../shared/store.util';

  const emailRegexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

  export const subscribeStore = loggable(
    mergeable({
      email: '',
      foundTenant: '',
      emailEmpty: false,
      emailSent: false,
      emailError: false,
      emailExists: false,
      loading: false
    })
  );

  function register() {
    $subscribeStore.loading = true;
    $subscribeStore.emailEmpty = false;
    $subscribeStore.emailError = false;
    $subscribeStore.emailExists = false;
    if (!$subscribeStore.email) $subscribeStore.emailEmpty = true;
    else if (!emailRegexp.test($subscribeStore.email)) $subscribeStore.emailError = true;
    else {
      onEmailChange($subscribeStore.email);
    }
  }

  async function onEmailChange(email: string) {
    $subscribeStore.emailExists = false;
    const result = await subscribeTenant(email);
    console.log('result: ', result);
    if (result.error) {
      if (result.code == 'email-exists') {
        $subscribeStore.emailExists = true;
        $subscribeStore.foundTenant = result.tenant;
      }
    } else {
      $subscribeStore.emailSent = true;
    }
    $subscribeStore.loading = false;
  }

  async function onForgotPassword() {
    $subscribeStore.emailExists = false;
    const response = await forgotPassword(
      $subscribeStore.email,
      $subscribeStore.foundTenant
    );
  }
</script>

<div class="my-4 text-sm text-gray-500">
  <h2>Step 1: subscribe with your email</h2>
  <h3>Why we need your e-mail?</h3>
  <ul>
    <li>To keep control of your account: e.g. password reset and DB credential reset</li>
    <li>To get notification about your users</li>
  </ul>
</div>

<div class="my-12 flex items-center ">
  <input
    class="bo-input"
    placeholder="Your email"
    name="email"
    type="email"
    required
    on:keyup={(e) => e.key === 'Enter' && register()}
    bind:value={$subscribeStore.email} />
  <button
    class:disabled={$subscribeStore.loading || !$subscribeStore.email}
    class="bo-button lg ml-2"
    on:click={register}>
    START
  </button>
  <div class="bo-loading ml-2" use:_if={$subscribeStore.loading} />
</div>

{#if $subscribeStore.emailEmpty}
  <div transition:fade class="bo-box-error mt-4">* An email should be provided</div>
{/if}
{#if $subscribeStore.emailError}
  <div transition:fade class="bo-box-error mt-4">
    * Please check your email for errors
  </div>
{/if}
{#if $subscribeStore.emailExists}
  <div class="bo-box-error">
    * This email already exists. If you forgot your password, click below to reset it:
    <br />
    <a class="bo-link" on:click={onForgotPassword}>Forgot password</a>
  </div>
{/if}
{#if $subscribeStore.emailSent}
  <div transition:fade class="bo-box-success mt-4">
    We sent you an email. Please check it to proceed to step 2.
  </div>
{/if}
