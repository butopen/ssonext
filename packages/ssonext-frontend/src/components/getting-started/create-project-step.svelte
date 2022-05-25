<script lang="ts">
  import { loggable, mergeable } from '../../shared/store.util';
  import { createEventDispatcher } from 'svelte';
  import { stopWriting } from '../../shared/on-stop-writing.event';
  import {
    confirmTenant,
    existsServiceName,
    navigateTo,
    saveToken,
    updateTenantService
  } from '../../services/api.service';
  import { _if } from '../../shared/if.svelte-action';
  import { setFullScreenLoading } from '../../stores/app.store';
  import { jwtDecode } from '../../shared/jwt-decode.service';

  const dispatch = createEventDispatcher();

  export let token = '';

  const store = loggable(
    mergeable({
      project: {
        name: '',
        code: '',
        destinationUrl: '',
        color: '#4bbee7'
      },
      confirmError: false,
      codeAlreadyExists: false
    })
  );

  async function onStopWriting() {
    $store.project.code = $store.project.code.toLowerCase().replace(/\W/gi, '');
    const existsResult = await existsServiceName($store.project.code);
    $store.codeAlreadyExists = existsResult.exists;
  }

  async function onNext() {
    setFullScreenLoading(true);
    const error = (e) => {
      store.merge({ confirmError: true });
      console.error(e);
    };
    try {
      let createUserResult = await confirmTenant(token);
      console.log('createUserResult: ', createUserResult);
      if (!createUserResult.error) {
        const userInfo = jwtDecode<{ tenant: string; email: string }>(
          createUserResult.token
        );
        saveToken(createUserResult.token);
        let service = {
          ...$store.project,
          email: userInfo.email,
          destinationUrl: $store.project.destinationUrl
        };
        await updateTenantService(service);
        navigateTo(`/app/dashboard?tenant=${userInfo.tenant}`);
      } else error(createUserResult);
    } catch (e) {
      error(e);
    }
    setFullScreenLoading(false);
  }

  function onNameChange() {
    $store.project.code = $store.project.name.toLowerCase().replace(/\W/gi, '');
  }
</script>

<div class="my-4 text-sm text-gray-500">
  <h2>Step 2: create a project</h2>

  <h3>1. Choose a name for your porject</h3>

  <div class="mt-2">
    <input
      class="bo-input"
      placeholder="Your project name"
      type="text"
      autofocus
      required
      pattern="[\w]+"
      use:stopWriting
      on:stopWriting={onStopWriting}
      on:keyup={onNameChange}
      bind:value={$store.project.name} />
  </div>

  <h3>2. Choose a code for your porject</h3>

  <div class="mt-2">
    <input
      use:stopWriting
      on:stopWriting={onStopWriting}
      class="bo-input"
      placeholder="Your project code"
      type="text"
      required
      pattern="[\w]+"
      bind:value={$store.project.code} />
  </div>
  <div>
    <small class="text-gray-400">* Only letters and numbers</small>
    <small class="block text-gray-400">* Lowercase</small>
    <small use:_if={$store.codeAlreadyExists} class="block w-96 text-red-400">
      * <b>{$store.project.code}</b>
      is already taken. Try
      <b>{$store.project.code}{Math.round(Math.random() * 100)}</b>
      or choose another code
    </small>
  </div>

  <h3 class="mt-12">3. Choose a color</h3>

  <div class="mt-2">
    <input
      class="bo-input"
      placeholder="Your project color"
      type="color"
      required
      bind:value={$store.project.color} />
  </div>

  <div class="mt-2">
    <input
      class="bo-input"
      placeholder="Destination URL after login"
      type="color"
      required
      bind:value={$store.project.destinationUrl} />
  </div>
  <small class="text-gray-400">
    The destination URL is required if you want to redirect to your own page after login
  </small>

  <div class="mt-12 text-right">
    <button
      class="bo-button"
      class:disabled={!$store.project.name ||
        !$store.project.code ||
        $store.codeAlreadyExists}
      on:click={onNext}>
      Next
    </button>
  </div>
  <div use:_if={$store.confirmError} class="bo-box-error">
    * It seems that you're already registered. Try to <a href="/app/login">login</a>
  </div>
</div>
