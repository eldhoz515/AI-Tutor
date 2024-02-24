<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { statusUrlPrefix } from "./Constants";
  import { navigate } from "svelte-routing";
  import { saveToLocal } from "./utils";

  export let key = "";
  const dispatch = createEventDispatcher();
  let status = null,
    query = "";

  const poller = setInterval(() => {
    getStatus();
  }, 5000);

  const getStatus = async () => {
    try {
      const res = await fetch(`${statusUrlPrefix}/${key}.json`);
      if (res.status != 200) throw res.statusText;
      const data = await res.json();
      status = data.status;
      query = data.query || "";
      saveToLocal(key, data);
      processStatus();
    } catch (e) {
      clearInterval(poller);
      console.error(e);
      dispatch("error");
    }
  };

  const processStatus = () => {
    if (!status) return;
    else if (status === "error") {
      throw `status is ${status}`;
    } else if (status === "rendering") {
      clearInterval(poller);
      navigate(`/play/${key}`);
    }
  };

  onMount(() => {
    getStatus();
  });
</script>

<div>
  {query}
  {#if status == "init"}{:else if status == "phase1"}{:else if status == "voiceGen"}{:else if status == "phase2"}{:else if status == "processing"}{/if}
</div>
