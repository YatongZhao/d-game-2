<script lang="ts">
import { heroItem, heroShop } from "../HeroShop";
import { fly } from "svelte/transition";
import { refresh$ } from "../const";

    export let unitVw: number;
    export let money: number;
    let heroList: (heroItem|null)[] = heroShop.heroList;
</script>

<div class="container"
    style={`width: ${unitVw*98}px;`}
    in:fly={{ x: -400 }} out:fly={{ x: 800 }}>
    <div class="hero-box">
        {#each heroList as hero, i}
            <div class="item" style={`width: ${unitVw*15}px;`}>
                {#if hero}
                <button style={`font-size: ${unitVw*4}px;`} disabled={money < hero.$} on:click={() => {
                    heroShop.buy(i);
                    heroList = heroShop.heroList;
                }}>{hero.name}</button>
                <span class:disabled={money < hero.$} style={`font-size: ${unitVw*3}px;margin-top: ${unitVw*1}px;`}>${hero.$}</span>
                {/if}
            </div>
        {/each}
    </div>
    <div class="top-box">
        <button style={`font-size: ${unitVw*3}px;`} class="refresh-btn"
            disabled={money < refresh$}
            on:click={() => {
                heroShop.refresh();
                heroList = heroShop.heroList;
            }}>刷新商品$20</button>
    </div>
</div>

<style lang="scss">
    .container {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
        box-sizing: border-box;
        box-shadow: 2px 3px 1px 1px rgba(0, 0, 0, .1);
        z-index: 10000;
        padding: 8px;
        padding-bottom: 0px;
        background-color: ghostwhite;
        .top-box {
            margin-bottom: 4px;
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
        }
        .refresh-btn {
            // position: absolute;
            // bottom: 100%;
            // right: 0;
            width: 100%;
            background-color: burlywood;
            color: white;
            border: none;
            border-radius: 5px;
            &:active {
                background-color: chocolate;
            }
            &:disabled {
                background-color: gainsboro;
            }
        }
        .hero-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .item {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            button {
                background-color: burlywood;
                width: 100%;
                color: white;
                border: none;
                border-radius: 5px;
                &:disabled {
                    background-color: gainsboro;
                }
                &:active {
                    background-color: chocolate;
                }
            }
            span.disabled {
                color: gainsboro;
            }
        }
    }
</style>
