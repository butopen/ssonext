<script lang="ts">
  import { loggable, mergeable } from '../shared/store.util';
  import { queryParams } from '../shared/url-params.service';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const params = queryParams<{ id: string }>();

  const s = loggable(mergeable({}));
</script>

<div class="$name">$name works!</div>

<style lang="scss">
  .$name {
    @apply block;
  }
</style>
