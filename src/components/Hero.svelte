<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { heroCanvasHeight, heroCanvasWidth, offStageHeroPosition, onStageHeroPosition } from "../const";
import { heroRenderer } from "../draw/drawHero";

    export let ratio: number;
    export let unitVw: number;
    export let selectedIndex: number;
    export let stage: 'on'|'off';
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
        <div class="top-container" style={`height:${15*unitVw + 'px'};`}>
            {#each onStageHeroPosition as pos, i}
                <div style={`left:${pos.x/10*unitVw + 'px'};top:${pos.y/10*unitVw + 'px'}`} class="item">
                    <div class:selected={stage === 'on' && selectedIndex === i} class:h={ratio > 2} class:w={ratio <= 2} class="inner"></div>
                </div>
            {/each}
        </div>
        <div class="bottom-container">
            {#each offStageHeroPosition as pos, i}
                <div style={`left:${pos.x/10*unitVw + 'px'};top:${pos.y/10*unitVw + 'px'}`} class="item">
                    <div class:selected={stage === 'off' && selectedIndex === i} class:h={ratio > 2} class:w={ratio <= 2} class="inner"></div>
                </div>
            {/each}
        </div>
    </div>
    <canvas class="hero-canvas" bind:this={heroCanvas} />
    <canvas class="move-canvas" bind:this={moveCanvas} />
</div>

<style lang="scss">
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
        position: absolute;
        width: 100%;
        background-color: rgba($color: lightgray, $alpha: 0.4);
		box-shadow: 0px 2px 2px 2px burlywood;
    }
    .bottom-container {
        display: flex;
        justify-content: center;
        position: relative;
    }
    .item {
        position: absolute;
        .inner {
            position: absolute;
            background-color: burlywood;
            transition: all 0.1s;
            border-radius: 4px;
            &.h {
                height: 4vw;
                width: 4vw;
                left: -2vw;
                top: -2vw;
                &.selected {
                    height: 8vw;
                    width: 8vw;
                    left: -4vw;
                    top: -4vw;
                }
            }
            &.w {
                height: 2vh;
                width: 2vh;
                left: -1vh;
                top: -1vh;
                &.selected {
                    height: 4vh;
                    width: 4vh;
                    left: -2vh;
                    top: -2vh;
                }
            }
        }
    }
</style>
