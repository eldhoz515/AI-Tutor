<script>
  import { createEventDispatcher } from "svelte";
  import Search from "./Search.svelte";
  import Wave from "./Icons/Wave.svelte";
  import History from "./Icons/History.svelte";
  import { navigate } from "svelte-routing";
  const dispatch = createEventDispatcher();
</script>

<div class="absolute w-full h-full overflow-hidden z-10">
  <div class="w-full h-full waveBg">
    <Wave />
  </div>
</div>

<img class="absolute z-20 w-96 bottom-0" src="tutor.png" alt="" />
<button
  class="absolute z-20 w-10 h-10 right-0 bottom-0 mr-5 mb-5"
  on:click={() => {
    navigate("/history");
  }}
>
  <History />
</button>

<h1 class="text-8xl text-center mt-[17rem] mb-24 font-bold">
  <span class="caret text-6xl text-secondary-500">^</span>
  <span class="supA text-secondary-500">a</span>
  Lerning is
  <span
    class="line-through decoration-[10px] text-secondary-600 decoration-secondary-500"
    >boring!</span
  >
</h1>
<div class="absolute z-30 w-full">
  <Search on:error />
</div>

<style>
  .waveBg {
    animation: scale 15s infinite ease-in-out;
    transform-origin: top;
  }
  @keyframes scale {
    0%,
    100% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(1.2);
    }
  }

  .caret {
    position: absolute;
    transform: translate(66px, 100px);
    rotate: 348deg;
  }
  .supA {
    position: absolute;
    transform: translate(83px, -61px);
    rotate: 348deg;
  }
</style>
