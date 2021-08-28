<script lang="ts">
import { onMount } from "svelte";
import { battleGroundHeight, battleGroundWidth } from "./const";
import { setCanvas } from "./draw";
import { game } from "./game";

    let canvas: HTMLCanvasElement;
	onMount(() => {
		canvas.width = battleGroundWidth;
		canvas.height = battleGroundHeight;
		setCanvas(canvas);
		game.startFighting();
	});
</script>

<main>
	<canvas class="main-canvas" bind:this={canvas} />
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
</style>
