<script>
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";

  const dispatch = createEventDispatcher();

  setTimeout(() => {
    dispatch("closeError");
  }, 1000 * 5);
</script>

<div
  transition:fly={{ x: 500, opacity: 0 }}
  class="bg-secondary-600 absolute z-[100] top-10 w-fit left-1/2 -translate-x-1/2 px-10 py-5 rounded-full text-2xl"
>
  Something went wrong!
</div>
