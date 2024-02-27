<script>
  import { createEventDispatcher } from "svelte";
  import Search from "./Search.svelte";
  const dispatch = createEventDispatcher();
</script>

<h1 class="text-7xl text-center mt-60 mb-40 font-medium">
  Lerning is <span class="line-through">boring</span>!
</h1>
<Search on:error />
