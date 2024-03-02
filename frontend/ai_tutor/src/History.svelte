<script>
  import { createEventDispatcher, onMount } from "svelte";
  import Play from "./Icons/Play.svelte";
  import { navigate } from "svelte-routing";
  import Blob from "./Icons/Blob.svelte";
  import Home from "./Icons/Home.svelte";

  let history = [];
  const dispatch = createEventDispatcher();

  onMount(() => {
    history = Object.keys(localStorage).map((key) => {
      const item = JSON.parse(localStorage.getItem(key));
      return { ...item, key };
    });
    history.reverse();
  });
</script>

<div class="absolute w-full h-full top-0 overflow-hidden">
  <div class="w-full h-full blobBg">
    <Blob />
  </div>
</div>
<div class="flex items-center mt-10 relative justify-between">
  <button
    class="w-6 h-6 ml-10"
    on:click={() => {
      navigate("/");
    }}
  >
    <Home />
  </button>
  <h1 class="w-fit text-5xl font-bold -ml-10">Recent Searches</h1>
  <div />
</div>

{#if history.length}
  <div
    class="w-fit mx-auto mt-20 min-w-[50vw] h-[60vh] overflow-y-auto p-10 bg-white bg-opacity-10 backdrop-blur-md"
  >
    {#each history as { query, key } (key)}
      {#if query}
        <button
          class="flex items-center py-2 px-5 mb-5 rounded-full w-full justify-center hover:bg-white hover:text-secondary-500 transition-colors text-2xl text-secondary-200 font-medium"
          on:click={() => {
            navigate(`/loading/${key}`);
          }}
        >
          {query.slice(0, 30)}
        </button>
      {/if}
    {/each}
  </div>
{:else}
  <h2 class="text-center text-4xl font-medium mt-60">
    Why empty?<br />Gimme a chance..
  </h2>
{/if}

<style>
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
  .blobBg {
    animation: rotate 50s infinite linear;
  }
</style>
