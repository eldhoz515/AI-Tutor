<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { getFromLocal } from "./utils";
  import { videoUrlPrefix, videoUrlSuffix } from "./Constants";

  export let key = "";
  let statusData,
    player,
    index = -1;
  const dispatch = createEventDispatcher();

  const playNextSegment = () => {
    index++;
    if (!statusData.renderIds[index]) return;
    player.src = `${videoUrlPrefix}${statusData.renderIds[index]}${videoUrlSuffix}`;
    player.play();
  };

  $: {
    if (statusData && player) playNextSegment();
  }

  onMount(() => {
    const data = getFromLocal(key);
    if (!data?.renderIds) {
      navigate(`/loading/${key}`);
    }
    statusData = data;
  });
</script>

<video
  class="w-full h-full"
  bind:this={player}
  on:ended={playNextSegment}
  controls
></video>
