<script lang="ts">
    export let ratio: number;
</script>

<div class="container" class:h={ratio > 2} class:w={ratio <= 2}>
    <button>霰弹</button>
</div>

<style>
    .container {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
        box-sizing: border-box;
        box-shadow: 3px 4px 5px 5px rgba(0, 0, 0, .1);
        z-index: 10000;
        background-color: white;
    }
    .w {
        width: 49vh;
    }
    .h {
        width: 98vw;
    }
</style>
