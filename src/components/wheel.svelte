
<script lang="ts">
  import { HSV, type Location } from "$lib";
  import { onMount } from "svelte";
  import Pointer from "./pointer.svelte";


export let radius: number = 70;
export let v_radius: number = 90;
export let v_width: number = 10;

const vars = {
    "radius": `${radius}px`,
    "v-radius": `${v_radius}px`,
    "v-width": `${v_width}px`,
}

$: style =  (() => {
    const style: string[] = [];
    for (const [key, value] of Object.entries(vars)) {
        style.push(`--${key}: ${value};`);
    }
    return style;
})()

const h: HSV = new HSV({
    x: v_radius - v_width,
    y: v_radius - v_width,
    radius: radius,
    v_radius: v_radius - (v_width / 2),
})

let hs_pointer: Location = {
    x: 0,
    y: 0,
}

let hs_hold: Location = {
    x: 0,
    y: 0,
}

let v_pointer: Location = {
    x: 0,
    y: 0,
}

let v_hold: Location = {
    x: 0,
    y: 0,
}

$: color = h.hsv;

function callback() {
    h.Point = hs_hold;
    hs_pointer = h.Point;

    h.VPoint = v_hold;
    v_pointer = h.VPoint;
}

onMount(() => {
    callback();

    hs_hold.x = hs_pointer.x;
    hs_hold.y = hs_pointer.y;
    v_hold.x = v_pointer.x;
    v_hold.y = v_pointer.y;
})

</script>

<div id="v" style="{style.join("")};--s-color: hsl({color.h}, {color.s}%, 50%);">
    <div id="v-inner" style="--color: hsl({color.h}, {color.s}%, {color.v}%);">
        <div id="hs">
            <div id="hs-overlay" />
        </div>
    </div>
</div>

<Pointer bind:point={hs_pointer} bind:hold={hs_hold} callback={callback} bind:hsv={h.hsv}/>
<Pointer bind:point={v_pointer} bind:hold={v_hold} callback={callback} bind:hsv={h.hsv}/>

<style>

#v {
    background: conic-gradient(black, var(--s-color), white);
    transform: rotateZ(-90deg);
    width: calc(var(--v-radius) * 2);
    height: calc(var(--v-radius) * 2);
    border-radius: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
}

#v-inner {
    background: var(--color);
    margin: auto auto;
    width: calc(var(--v-radius) * 2 - var(--v-width) * 2);
    height: calc(var(--v-radius) * 2 - var(--v-width) * 2);
    border-radius: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
}

#hs {
    background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
    width: calc(var(--radius) * 2);
    height: calc(var(--radius) * 2);
    border-radius: 100%;
    margin: auto auto;

    display: flex;
    flex-direction: column;
    justify-content: center;
}

#hs-overlay {
    background: radial-gradient(circle closest-side, #fff, transparent);
    width: calc(var(--radius) * 2);
    height: calc(var(--radius) * 2);
    border-radius: 100%;
}
</style>