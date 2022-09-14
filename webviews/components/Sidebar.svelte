<script lang="ts">
    import { onMount } from "svelte";
    import CreatePost from "../screens/CreatePost.svelte";
    import Search from "../screens/Search.svelte";

    import type { State } from "../shared/types";
    let lastState = tsvscode.getState();

    let state: State = { page: "search" };

    onMount(async () => {
        state = { page: "search" };
    });

    $: {
        tsvscode.setState(state);
    }
</script>

<main>
    {#if state.page === "search"}
        <Search
            toCreate={() => {
                state = { page: "create" };
            }}
        />
    {:else if state.page === "show"}
        <h1>Show</h1>
        <button
            on:click={() => {
                state = { page: "search" };
            }}
        >
            searchへ
        </button>
    {:else if state.page === "create"}
        <CreatePost
            toSearch={() => {
                state = { page: "search" };
            }}
        />
    {:else if state.page === "edit"}
        <h1>Edit</h1>
        <button
            on:click={() => {
                state = { page: "show" };
            }}
        >
            showへ
        </button>
    {/if}
</main>

<style>
</style>
