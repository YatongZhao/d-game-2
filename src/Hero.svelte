<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { heroCanvasHeight, heroCanvasWidth, offStageHeroPosition, onStageHeroPosition } from "./const";
import { heroRenderer } from "./draw/drawHero";

    let heroCanvas: HTMLCanvasElement;
    let moveCanvas: HTMLCanvasElement;

    onMount(() => {
		heroCanvas.width = heroCanvasWidth;
		heroCanvas.height = heroCanvasHeight;
		heroRenderer.addOutHeroCanvas(heroCanvas);
		moveCanvas.width = heroCanvasWidth;
		moveCanvas.height = heroCanvasHeight;
        heroRenderer.addOutMoveCanvas(moveCanvas);
    });

    onDestroy(() => {
        heroRenderer.removeOutHeroCanvas(heroCanvas);
        heroRenderer.removeOutMoveCanvas(moveCanvas);
    });
</script>

<div class="container">
    <div class="bg">
        <div class="top-container">
            {#each onStageHeroPosition as pos}
                <div class="item"></div>
            {/each}
        </div>
        <div class="bottom-container">
            {#each offStageHeroPosition as pos}
                <div class="item"></div>
            {/each}
        </div>
    </div>
    <canvas class="hero-canvas" bind:this={heroCanvas} />
    <canvas class="move-canvas" bind:this={moveCanvas} />
</div>

<style>
    .container {
        width: 100%;
        position: relative;
    }
    .bg {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 99;
    }
    canvas {
        width: 100%;
        display: block;
        position: relative;
        z-index: 100;
    }
    .move-canvas {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        z-index: 101;
    }
    .top-container {
        display: flex;
        justify-content: center;
    }
    .bottom-container {
        display: flex;
        justify-content: center;
        margin-top: -1%;
    }
    .item {
        width: 5%;
        padding-top: 5%;
        margin: 2%;
        margin-top: 4.5%;
        border-radius: 4px;
        box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, .2);
    }
</style>
