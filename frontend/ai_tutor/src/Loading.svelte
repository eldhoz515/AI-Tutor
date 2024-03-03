<script>
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import {
    displayStatuses,
    loadingStatuses,
    statusPollingInterval,
    statusUrlPrefix,
    jokesUrlPrefix,
    wordReadTime,
    jokePreTime,
    wordDisplayOffsetTime,
  } from "./Constants";
  import { navigate } from "svelte-routing";
  import { saveToLocal } from "./utils";
  import { Shadow } from "svelte-loading-spinners";
  import Home from "./Icons/Home.svelte";
  import Blob from "./Icons/BlobScatter.svelte";

  export let key = "";
  const dispatch = createEventDispatcher();
  let status = null,
    query = "",
    progressBar,
    joke,
    jokeGetter,
    displayJoke,
    poller;

  $: {
    if (joke) {
      setJokeTimeout();
      displayJoke = "";
      setDisplayJoke(joke.split(" "));
    }
  }

  const setDisplayJoke = (splits) => {
    if (splits.length) {
      displayJoke = `${displayJoke} ${splits[0]}`;
      setTimeout(() => {
        setDisplayJoke(splits.slice(1));
      }, wordReadTime - wordDisplayOffsetTime);
    }
  };

  const setRandomJoke = async () => {
    try {
      const res = await fetch(`${jokesUrlPrefix}/jokes.json`);
      if (res.status != 200) throw res.statusText;
      const jokes = await res.json();
      joke = jokes[Math.floor(Math.random() * jokes.length)]["joke"];
    } catch (e) {
      console.error(e);
      jokeGetter = setTimeout(() => {
        setRandomJoke();
      }, 1000);
    }
  };

  const setJokeTimeout = () => {
    const words = joke.split(" ").length;
    const jokeTimeout = words * wordReadTime + jokePreTime;
    jokeGetter = setTimeout(() => {
      setRandomJoke();
    }, jokeTimeout);
  };

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
    else if (status == loadingStatuses.error) {
      throw `status is ${status}`;
    } else if (status == loadingStatuses.rendered) {
      clearInterval(poller);
      navigate(`/play/${key}`);
    }
  };

  onMount(() => {
    getStatus();
    setTimeout(() => {
      progressBar.style.width = "95%";
    }, 10);
    setRandomJoke();
    poller = setInterval(() => {
      getStatus();
    }, statusPollingInterval);
  });

  onDestroy(() => {
    if (poller) clearInterval(poller);
    if (jokeGetter) clearTimeout(jokeGetter);
  });
</script>

<div class="absolute w-full h-full overflow-hidden">
  <div class="w-full h-full blobBg">
    <Blob />
  </div>
</div>
<div class="absolute w-full z-20">
  <div class="h-2 w-full bg-black mb-10">
    <div
      bind:this={progressBar}
      class="h-full w-0 bg-secondary-700 progressBar rounded-r-full"
    ></div>
  </div>

  <div class="flex items-center justify-between px-10">
    <button
      class="block w-6 h-6"
      on:click={() => {
        navigate("/");
      }}
    >
      <Home />
    </button>
    <div class="w-fit text-3xl font-medium flex items-center">
      {query?.slice(0, 30)}
      <div class="w-fit h-fit ml-10">
        <Shadow color="#fff" size="50" unit="px" />
      </div>
    </div>
    <div />
  </div>

  <div class="mt-20 ml-20 font-light">
    While you wait, check out these <span class="font-bold text-secondary-500"
      >ചളീസ്..</span
    >
  </div>

  <div
    class="whitespace-pre-line mt-12 w-3/4 h-3/4 overflow-hidden p-5 rounded-xl mx-auto font-['Noto_Sans_Malayalam'] text-2xl font-medium"
  >
    {displayJoke || "Loading"}
  </div>
</div>
<div
  class="h-fit w-full absolute bottom-10 right-10 flex justify-end items-center z-10"
>
  <div class="mr-8 font-light">
    {displayStatuses[status]}
  </div>
  <div class="w-fit h-fit">
    <Shadow color="#48adff" size="30" unit="px" />
  </div>
</div>

<style>
  .progressBar {
    transition: width 180s linear;
  }

  .blobBg {
    animation: scale 15s infinite ease-in-out;
  }
  @keyframes scale {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
</style>
