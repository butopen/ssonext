<script lang="ts">
  import { loggedWritable } from '../../shared/store.util';
  import SubscribeStep from './subscribe-step.svelte';
  import { forgotPassword, subscribeTenant } from '../../services/api.service';

  export const gettingStartedStore = loggedWritable({
    steps: [
      { name: 'Confirm your email', status: 'active' },
      { name: 'Create a project', status: 'todo' },
      { name: 'Start managing users', status: 'todo' }
    ],
    activeStep: 0,
    email: '',
    foundTenant: '',
    emailExists: false
  });

  async function onEmailChange(emailEvent: CustomEvent<{ email: string }>) {
    $gettingStartedStore.emailExists = false;
    const email = emailEvent.detail.email;
    $gettingStartedStore.email = email;
    const result = await subscribeTenant(email);
    console.log('result: ', result);
    if (result.error) {
      if (result.code == 'email-exists') {
        $gettingStartedStore.emailExists = true;
        $gettingStartedStore.foundTenant = result.tenant;
      }
    }
  }

  async function onForgotPassword() {
    $gettingStartedStore.emailExists = false;
    const response = await forgotPassword(
      $gettingStartedStore.email,
      $gettingStartedStore.foundTenant
    );
    console.log('response: ', response);
  }
</script>

<div class="flex justify-center">
  <div class="getting-started">
    <div>
      <h1 class="my-8 text-3xl font-black text-gray-700">Get started in 3 steps</h1>
      <div class="bo-steps">
        {#each $gettingStartedStore.steps as step}
          <div class={'bo-step-' + step.status}>{step.name}</div>
        {/each}
      </div>
    </div>

    <div class="step-content sso-section">
      {#if $gettingStartedStore.activeStep == 0}
        <SubscribeStep on:email-change={onEmailChange} />
      {/if}
      {#if $gettingStartedStore.emailExists}
        <div class="bo-box-error">
          * This email already exists. If you forgot your password, click below:
          <br />
          <a class="bo-link" on:click={onForgotPassword}>Forgot password</a>
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .getting-started {
    @apply mx-auto flex flex-col flex-wrap items-center p-4 md:flex-row;
    min-height: 560px;

    .step-content {
      @apply m-8;
    }
  }
</style>
