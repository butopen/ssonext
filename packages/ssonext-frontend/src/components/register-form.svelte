<script lang="ts">
  import { loggable, mergeable } from '../shared/store.util';
  import { queryParams } from '../shared/url-params.service';
  import { createEventDispatcher } from 'svelte';
  import { useForm, validators, email, required, Hint } from 'svelte-use-form';
  import { emailExists, requestRegistration } from '../services/api.service';
  import { _if } from '../shared/if.svelte-action';
  import { pattern } from '../shared/pattern.validator';
  import { notifyOnError, showNotification } from './notification/notification.store';

  const dispatch = createEventDispatcher();

  const params = queryParams<{ tenant: string }>();

  const s = loggable(
    mergeable({
      name: '',
      surname: '',
      email: '',
      password: '',
      emailExists: false,
      loading: false
    })
  );
  const form = useForm();

  async function checkEmail() {
    $s.emailExists = false;
    const exists = await emailExists($s.email, params.tenant);
    $s.emailExists = exists.exists;
  }

  async function register() {
    $s.loading = true;
    await notifyOnError(async () => {
      return await requestRegistration($s, params.tenant);
    }, 'There was an error while registering. Please try later');
    $s.loading = false;
  }
</script>

<div class="register-form">
  <form use:form>
    <label>Name</label>
    <input type="text" name="name" use:validators={[required]} bind:value={$s.name} />
    <Hint for="name" on="required">
      <span class="form-error">Name is mandatory</span>
    </Hint>

    <label>Surname</label>
    <input
      type="text"
      name="surname"
      use:validators={[required]}
      bind:value={$s.surname} />
    <Hint for="surname" on="required">
      <span class="form-error">Surname is mandatory</span>
    </Hint>

    <label>E-mail</label>
    <input
      type="email"
      name="email"
      use:validators={[required, email]}
      on:blur={checkEmail}
      bind:value={$s.email} />
    <Hint for="email" on="required">
      <span class="form-error">E-mail is mandatory</span>
    </Hint>
    <Hint for="email" on="email">
      <span class="form-error">Please provide a valid e-mail</span>
    </Hint>
    <span class="form-error" use:_if={$s.emailExists}>
      This e-mail already exists. Did you forget your password?
    </span>

    <label>Password</label>
    <input
      type="password"
      name="password"
      bind:value={$s.password}
      use:validators={[
        required,
        pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      ]} />

    <Hint for="password" on="pattern">
      <span class="form-error">
        Insert at least a number, a symbol and a capital letter (minimum 8 characters)
      </span>
    </Hint>

    <div class="mt-4 flex">
      <button
        on:click={register}
        class="bo-button"
        class:disabled={!$form.valid || $s.loading}
        type="button">
        Sign-up
      </button>
      <div class="bo-loading" use:_if={$s.loading} />
    </div>
  </form>
</div>

<style lang="scss">
  .register-form {
    @apply block;
  }
</style>
