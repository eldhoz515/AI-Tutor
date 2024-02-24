<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./Home.svelte";
  import Loading from "./Loading.svelte";
  import Error from "./Error.svelte";
  import Play from "./Play.svelte";

  export let url = "";
  let error = false;

  const onError = () => (error = true);
</script>

<Router {url}>
  <Route path="">
    <Home on:error={onError} />
  </Route>
  <Route path="loading/:key" let:params>
    <Loading key={params.key} on:error={onError}/>
  </Route>
  <Route path="play/:key" let:params>
    <Play key={params.key} on:error={onError}/>
  </Route>
</Router>

{#if error}
  <Error
    on:closeError={() => {
      error = false;
    }}
  />
{/if}
