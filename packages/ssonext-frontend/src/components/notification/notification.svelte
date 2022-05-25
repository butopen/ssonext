<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { notificationStore } from './notification.store';
  import { discardNotification } from './notification.store';

  const dispatch = createEventDispatcher();
</script>

<div class="bo-notifications">
  {#each $notificationStore.notifications as n, i}
    <div
      class="bo-notification-close bo-box-{n.type}"
      on:click={(e) => discardNotification(i)}>
      {n.message}
    </div>
  {/each}
</div>

<style lang="scss">
  .notification {
    @apply block;
  }
</style>
