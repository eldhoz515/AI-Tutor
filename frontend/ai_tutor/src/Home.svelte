<script>
  import { createEventDispatcher } from "svelte";
  import Search from "./Search.svelte";
  const dispatch = createEventDispatcher();
</script>

<h1 class="text-7xl text-center mt-60 mb-40 font-medium">
  Lerning shuldn't b boring!
</h1>
<Search on:error />
