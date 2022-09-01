<script lang="ts">
    import { onMount } from "svelte";

    import type { State } from "../shared/types";
    let lastState = tsvscode.getState();
    function removeLoadingImgsFromState(s: State) {
        if (s.page === "review-code-imgs") {
            return {
                ...s,
                codeImgIds: s.codeImgIds.filter((x) => x.value),
            };
        }
        return s;
    }

    let state: State =
        lastState && lastState.page !== "loading"
            ? removeLoadingImgsFromState(lastState)
            : { page: "loading" };

    onMount(async () => {
        state = { page: "search" };
    });

    $: {
        tsvscode.setState(state);
    }
</script>

<main>
    error recorder index
    {#if state.page === "search"}
        <h1>Search</h1>
        <button
            on:click={() => {
                state = { page: "show" };
            }}>showへ</button
        >
        <button
            on:click={() => {
                state = { page: "edit" };
            }}>editへ</button
        >
    {:else if state.page === "show"}
        <h1>Show</h1>
        <button
            on:click={() => {
                state = { page: "search" };
            }}>searchへ</button
        >
    {:else if state.page === "edit"}
        <h1>Edit</h1>
        <button
            on:click={() => {
                state = { page: "show" };
            }}>showへ</button
        >
    {/if}
</main>

<style>
</style>
