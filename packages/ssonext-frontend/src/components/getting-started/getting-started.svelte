<script lang="ts">
  import SubscribeStep from './subscribe-step.svelte';
  import CreateProjectStep from './create-project-step.svelte';
  import { queryParams } from '../../shared/url-params.service';
  import { loggable, mergeable } from '../../shared/store.util';

  export const gettingStartedStore = loggable(
    mergeable({
      steps: [
        { name: 'Confirm your email', status: 'active' },
        { name: 'Create a project', status: 'todo' },
        { name: 'Start managing users', status: 'todo' }
      ],
      activeStep: 0,
      token: ''
    })
  );

  const params = queryParams<{ step?: string; token?: string }>();

  if (params.step == '2') {
    $gettingStartedStore.activeStep = 1;
    $gettingStartedStore.token = params.token;
    $gettingStartedStore.steps[0].status = 'done';
    $gettingStartedStore.steps[1].status = 'active';
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
        <SubscribeStep />
      {/if}

      {#if $gettingStartedStore.activeStep == 1}
        <CreateProjectStep token={$gettingStartedStore.token} />
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
