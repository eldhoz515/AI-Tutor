<script>
  import { createEventDispatcher } from "svelte";
  import Search from "./Search.svelte";
  import Wave from "./Icons/Wave.svelte";
  const dispatch = createEventDispatcher();
</script>

<div class="absolute w-full h-full overflow-hidden z-10">
  <div class="w-full h-full waveBg">
    <Wave />
  </div>
</div>
<img class="absolute z-20 w-96 bottom-0" src="tutor.png" alt="" />
<h1 class="text-8xl text-center mt-[17rem] mb-24 font-bold">
  Lerning is <span
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
</style>
