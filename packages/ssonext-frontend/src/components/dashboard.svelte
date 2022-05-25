<script lang="ts">
  import { loggable, mergeable } from '../shared/store.util';
  import { queryParams } from '../shared/url-params.service';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const params = queryParams<{ tenant: string }>();

  const s = loggable(mergeable({}));
</script>

<div class="dashboard">
  <div class="flex justify-center">ciao</div>
</div>

<style lang="scss">
  .dashboard {
    @apply block;
  }
</style>
