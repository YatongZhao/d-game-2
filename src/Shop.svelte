<script lang="ts">
import { heroItem, heroShop } from "./HeroShop";
import { fly } from "svelte/transition";

    export let ratio: number;
    export let unitVw: number;
    export let money: number;
    let heroList: (heroItem|null)[] = heroShop.heroList;
</script>

<div class="container" class:h={ratio > 2} class:w={ratio <= 2}
    style={`width: ${unitVw*98}px;`}
    in:fly={{ x: -400 }} out:fly={{ x: 800 }}>
    {#each heroList as hero, i}
        {#if hero}
        <button disabled={money < hero.$} on:click={() => {
            heroShop.buy(i);
            heroList = heroShop.heroList;
        }}>{hero.name}</button>
        {/if}
    {/each}
</div>

<style>
    .container {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
        box-sizing: border-box;
        box-shadow: 2px 3px 1px 1px rgba(0, 0, 0, .1);
        z-index: 10000;
        padding: 8px;
        background-color: ghostwhite;
    }
</style>
