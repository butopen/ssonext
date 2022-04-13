<script lang="ts">
  import { loggedWritable } from '../../shared/store.util';
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const emailRegexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

  export const subscribeStore = loggedWritable({
    email: '',
    emailEmpty: false,
    emailError: false,
    emailRegistered: false
  });

  function register() {
    $subscribeStore.emailEmpty = false;
    $subscribeStore.emailError = false;
    if (!$subscribeStore.email) $subscribeStore.emailEmpty = true;
    else if (!emailRegexp.test($subscribeStore.email)) $subscribeStore.emailError = true;
    else {
      $subscribeStore.emailRegistered = true;
      dispatch('email-change', { email: $subscribeStore.email });
    }
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
  <button class="bo-button lg ml-2" on:click={register}>START</button>
</div>

{#if $subscribeStore.emailEmpty}
  <div transition:fade class="bo-box-error mt-4">* An email should be provided</div>
{/if}
{#if $subscribeStore.emailError}
  <div transition:fade class="bo-box-error mt-4">
    * Please check your email for errors
  </div>
{/if}
{#if $subscribeStore.emailRegistered}
  <div transition:fade class="bo-box-success mt-4">
    We sent you an email. Please check to proceed to step 2.
  </div>
{/if}
