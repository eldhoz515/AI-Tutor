<script>
  import Search from "./Icons/Search.svelte";
  import { searchUrl } from "./Constants";
  import { navigate } from "svelte-routing";
  import { createEventDispatcher } from "svelte";
  import { saveToLocal } from "./utils";

  let query = "",
    disabled = false,
    searchBar;
  const dispatch = createEventDispatcher();

  $: {
    if (query) query = query.charAt(0).toUpperCase() + query.slice(1);
  }

  const getKey = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleSearch = async () => {
    if (!query) return;
    disabled = true;
    const key = getKey();
    try {
      const res = await fetch(searchUrl, {
        method: "POST",
        body: JSON.stringify({ query: query, key: key }),
      });
      if (res.status == 200) {
        saveToLocal(key, {});
        navigate(`loading/${key}`);
      } else {
        throw res.statusText;
      }
    } catch (e) {
      console.error(e);
      dispatch("error");
    }
    disabled = false;
  };
</script>

<button
  class="rounded-full mx-auto bg-gray-950 w-1/2 flex items-center px-10"
  on:click={() => {
    searchBar?.focus();
  }}
>
  <Search />
  <input
    {disabled}
    type="text"
    class="pl-10 w-full block h-20 outline-none rounded-full text-3xl bg-transparent placeholder-white"
    placeholder="Esk me anyting..."
    bind:value={query}
    bind:this={searchBar}
    on:keydown={(e) => {
      if (e.key === "Enter") handleSearch();
    }}
  />
</button>
