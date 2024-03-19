<script>
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { getFromLocal } from "./utils";
  import Play from "./Icons/Play.svelte";
  import Pause from "./Icons/Pause.svelte";
  import EnterFullscreen from "./Icons/EnterFullscreen.svelte";
  import ExitFullscreen from "./Icons/ExitFullscreen.svelte";
  import Home from "./Icons/Home.svelte";
  import {
    currentPositionCheckInterval,
    interFaceTimeoutDuration,
    videoUrlPrefix,
    videoUrlSuffix,
  } from "./Constants";

  export let key = "";
  let statusData,
    renderIds,
    playerInterface,
    duration,
    interfaceTimeout,
    players = [],
    currentPositionChecker,
    isPausedChecker,
    currentPosition = 0,
    seeking = false,
    showInterface = false,
    paused = true,
    fullscreen = false,
    index = 0;
  const dispatch = createEventDispatcher();

  $: {
    if (renderIds?.length) calculateDuration();
  }

  $: {
    if (players.length) {
      syncPlayers();
      calculateDuration();
      startPlaying();
    }
  }

  const startPlaying = () => {
    players[index]?.play();
  };

  const isFullscreen = () => {
    fullscreen = document.fullscreenElement !== null;
    return fullscreen;
  };

  const toggleFullscreen = () => {
    if (isFullscreen()) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const isPaused = () => {
    if (!players[index]) return;
    return (
      players[index].paused ||
      players[index].ended ||
      players[index].currentTime == 0 ||
      players[index].readyState < 2
    );
  };

  const handleShowInterface = () => {
    showInterface = true;
    if (interfaceTimeout) clearTimeout(interfaceTimeout);
    interfaceTimeout = setTimeout(() => {
      showInterface = false;
      clearTimeout(interfaceTimeout);
    }, interFaceTimeoutDuration);
  };

  const getDurationUptoN = (n = players.length) => {
    if (players.length != renderIds.length) return;
    if (n == 0) return 0;
    try {
      const durationSum = players.slice(0, n).reduce((total, player) => {
        if (player.duration) return total + player.duration;
        else throw "All segments haven't loaded.";
      }, 0);
      return durationSum;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const changeCurrentPosition = () => {
    const sum = getDurationUptoN(index);
    if (sum == null) return;
    currentPosition = sum + players[index].currentTime;
  };

  const calculateDuration = () => {
    const sum = getDurationUptoN();
    if (!sum) return;
    duration = sum;
  };

  const seekTo = () => {
    seeking = true;
    let i = 0;
    let reducedDuration = currentPosition;
    while (reducedDuration > players[i].duration && i < players.length - 1) {
      reducedDuration -= players[i].duration;
      i++;
    }
    switchSegment(i);
    players[index].currentTime = reducedDuration;
    seeking = false;
  };

  const syncPlayers = () => {
    players = [...players.slice(0, renderIds.length)];
  };

  const removeSegment = (renderId) => {
    console.error(`Failed to load segment ${renderId}`);
    renderIds = [...renderIds.filter((value) => value != renderId)];
  };

  const switchSegment = (nextIndex) => {
    players[index].pause();
    if (nextIndex >= 0 && nextIndex < renderIds.length) {
      players[index].style.zIndex = -index;
      index = nextIndex;
      players[index].style.zIndex = 100;
      players[index].play();
    }
  };

  const togglePlayer = () => {
    if (paused) players[index].play();
    else players[index].pause();
  };

  const handleKeyDown = (event) => {
    switch (event.code) {
      case "Enter":
      case "Space":
        togglePlayer();
        break;
      case "KeyF":
        toggleFullscreen();
        break;
      case "ArrowLeft":
        currentPosition = Math.max(0, currentPosition - 5);
        seekTo();
        break;
      case "ArrowRight":
        currentPosition = Math.min(duration, currentPosition + 5);
        seekTo();
        break;
      default:
        return;
    }
  };

  onMount(() => {
    const data = getFromLocal(key);
    if (!data?.renderIds) {
      navigate(`/loading/${key}`);
      return;
    }
    statusData = data;
    renderIds = data.renderIds;

    currentPositionChecker = setInterval(() => {
      changeCurrentPosition();
    }, currentPositionCheckInterval);
    isPausedChecker = setInterval(() => {
      paused = isPaused();
    }, 100);
    document.addEventListener("fullscreenchange", isFullscreen);
    document.addEventListener("keydown", handleKeyDown);
    isFullscreen();
  });

  onDestroy(() => {
    if (currentPositionChecker) clearInterval(currentPositionChecker);
    if (isPausedChecker) clearInterval(isPausedChecker);
    document.removeEventListener("keydown", handleKeyDown);
  });
</script>

{#if renderIds}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="relative w-full h-[100vh]"
    on:mousemove={handleShowInterface}
    on:mousedown={handleShowInterface}
    on:drag={handleShowInterface}
    on:dragenter={handleShowInterface}
  >
    <div
      bind:this={playerInterface}
      class="absolute flex flex-col justify-between z-[101] w-full h-full bg-black bg-opacity-50
    {showInterface ? 'visible' : 'hidden'}"
    >
      <div class="mt-10 flex items-center justify-between px-10">
        <button
          class="block w-6 h-6"
          on:click={() => {
            navigate("/");
          }}
        >
          <Home />
        </button>
        <div class="w-fit text-3xl font-medium">
          {statusData?.query?.slice(0, 30)}
        </div>
        <div />
      </div>
      {#if players[index]}
        <div class="flex justify-center">
          {#if paused}
            <button class="w-32 h-32 block" on:click={togglePlayer}>
              <Play />
            </button>
          {:else}
            <button class="w-16 h-16 block" on:click={togglePlayer}>
              <Pause />
            </button>
          {/if}
        </div>
      {/if}
      <div
        class="flex justify-between gap-20 px-10 mb-10 w-full h-10 items-center"
      >
        <div class="w-full h-full">
          {#if duration}
            <input
              bind:value={currentPosition}
              class="w-full h-full accent-secondary-500 cursor-pointer"
              type="range"
              min="0"
              max={duration}
              on:change={seekTo}
            />
          {/if}
        </div>
        <button class="w-6 h-full block" on:click={toggleFullscreen}>
          {#if fullscreen}
            <ExitFullscreen />
          {:else}
            <EnterFullscreen />
          {/if}
        </button>
      </div>
    </div>
    {#each renderIds as renderId, i (renderId)}
      <!-- svelte-ignore a11y-media-has-caption -->
      <video
        src="{videoUrlPrefix}{renderId}{videoUrlSuffix}"
        class="absolute w-full h-full"
        style="z-index:{-i}"
        bind:this={players[i]}
        on:durationchange={calculateDuration}
        on:error={() => {
          removeSegment(renderId);
        }}
        on:ended={() => {
          switchSegment(i + 1);
        }}
      ></video>
    {/each}
  </div>
{/if}
