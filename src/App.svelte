<script lang="ts">
import { onMount } from "svelte";
import { battleGroundDistance, battleGroundHeight, battleGroundWidth, heroCanvasHeight, heroCanvasWidth, HPHeight, HPWidth } from "./const";
import { setCanvas } from "./draw";
import { setHero, setHeroCanvas } from "./draw/drawHero";
import { setHP, setHPCanvas } from "./draw/drawHP";
import { game } from "./game";
import { port2 } from "./messageChannel";
import Shop from "./Shop.svelte";

    let canvas: HTMLCanvasElement;
    let HPCanvas: HTMLCanvasElement;
    let heroCanvas: HTMLCanvasElement;
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
		canvas.height = battleGroundDistance;
		setCanvas(canvas);

		HPCanvas.width = HPWidth;
		HPCanvas.height = HPHeight;
		setHPCanvas(HPCanvas);

		heroCanvas.width = heroCanvasWidth;
		heroCanvas.height = heroCanvasHeight;
		setHeroCanvas(heroCanvas);

		game.startFighting();
		port2.onmessage = handleMessage;
	});
</script>

<main>
	<canvas class="main-canvas" bind:this={canvas} />
	<canvas class="hero-canvas" bind:this={heroCanvas} />
	<div class="hp-box">
		<canvas class="hp-canvas" bind:this={HPCanvas} />
		<span class="hp-span">{HP}/1000</span>
	</div>
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
		position: fixed;
		bottom: 32vw;
		left: 0;
		z-index: 1;
	}
	.hero-canvas {
		width: 100vw;
		position: fixed;
		bottom: -1px;
		left: 0;
		background-color: gainsboro;
		box-shadow: 0px -2px 1px 1px burlywood;
		border-top: 1px solid gray
	}
	.hp-box {
		position: fixed;
		top: 2vw;
		left: 0;
		width: 100vw;
		height: 3.8vw;
		z-index: 5;
		opacity: .8;
	}
	.hp-canvas {
		background-color: #aaa;
		box-sizing: border-box;
		position: absolute;
		width: 98vw;
		left: 1vw;
		border-radius: 3px;
		border: 1px solid #333;
		z-index: -1;
		height: 100%;
	}
	.hp-span {
		font-size: 12px;
		color: white;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		line-height: 3.8vw;
		bottom: 0;
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
