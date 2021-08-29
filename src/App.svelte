<script lang="ts">
import { onMount } from "svelte";
import { battleGroundHeight, battleGroundWidth, HPHeight, HPWidth } from "./const";
import { setCanvas } from "./draw";
import { setHP, setHPCanvas } from "./draw/drawHP";
import { game } from "./game";
import { port2 } from "./messageChannel";
import Shop from "./Shop.svelte";

    let canvas: HTMLCanvasElement;
    let HPCanvas: HTMLCanvasElement;
	let HP = 0;
	let showShop = false;

	function handleMessage(msg: MessageEvent) {
		HP = msg.data.HP;
		setHP(HP);
	}

	function handleShow() {
		showShop = !showShop;
	}

	onMount(() => {
		canvas.width = battleGroundWidth;
		canvas.height = battleGroundHeight;
		setCanvas(canvas);

		HPCanvas.width = HPWidth;
		HPCanvas.height = HPHeight;
		setHPCanvas(HPCanvas);

		game.startFighting();
		port2.onmessage = handleMessage;
	});
</script>

<main>
	<canvas class="main-canvas" bind:this={canvas} />
	<canvas class="hp-canvas" bind:this={HPCanvas} />
	<span class="hp-span">{HP}/1000</span>
	<div class="event-mask" on:click={() => {
		showShop = false;
	}}></div>
	<button on:click={handleShow} class="main-btn">商店</button>
	{#if showShop}
		<Shop />
	{/if}
</main>

<style>
	main {
		overflow: hidden;
	}
	.main-canvas {
		width: 100vw;
		/* height: 100vh; */
		position: fixed;
		bottom: 0;
		left: 0;
	}
	.hp-canvas {
		background-color: #aaa;
		box-sizing: border-box;
		width: 98vw;
		position: fixed;
		bottom: 32vw;
		left: 1vw;
		border-radius: 3px;
		border: 1px solid #333;
		z-index: -1;
	}
	.hp-span {
		bottom: 32vw;
		font-size: 12px;
		color: white;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		line-height: 12px;
		margin-bottom: 1px;
	}
	.event-mask {
		position: fixed;
		width: 100vw;
		height: 100vh;
		z-index: 1000;
	}
    .main-btn {
        position: fixed;
		z-index: 1001;
		bottom: 38vw;
        right: 2vw;
    }
</style>
