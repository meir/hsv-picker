
<script lang="ts">
  import type { Location, hsv } from "$lib";

    export let point: Location = {
        x: 0,
        y: 0,
    }
    export let size = 20;
    export let callback: () => void = () => {};
    export let hsv: hsv = {
        h: 0,
        s: 0,
        v: 0,
    }
    export let hold: Location = {
        x: 0,
        y: 0,
    }

    let holding = false;

    const update = (e: MouseEvent) => {
        if (holding) {
            hold.x = e.clientX - size / 2;
            hold.y = e.clientY - size / 2;
            callback();
        }
    }

    const down = (e: MouseEvent) => {
        holding = true;
        update(e);
        document.addEventListener("mousemove", update);
        callback();
    }

    const release = () => {
        holding = false;
        document.removeEventListener("mousemove", update);
        callback();
        hold.x = point.x;
        hold.y = point.y;
    }
</script>

<div 
    id="pointer" 
    style="left: {hold.x}px; top: {hold.y}px; --size: {size}px;"
    on:mousedown={down}
    on:mouseup={release}
/>

<div 
    id="pos" 
    style="left: {point.x+size/4}px; top: {point.y+size/4}px; --size: {size}px; --color: hsl({hsv.h}, {hsv.s}%, {hsv.v}%);"
/>

<style>
    #pointer {
        position: absolute;
        width: calc(var(--size) / 2);
        height: calc(var(--size) / 2);
        border-radius: 100%;
        border: black calc(var(--size) / 4) solid;
        z-index: 2;
    }

    #pos {
        position: absolute;
        width: calc(var(--size) / 2);
        height: calc(var(--size) / 2);
        border-radius: 100%;
        background: var(--color);
        border: black 1px solid;
    }

    #pointer, #pos {
        user-drag: none;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
</style>