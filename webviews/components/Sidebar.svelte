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
        <h1>エラー検索</h1>
        <div class="search-input">
            <input type="text" placeholder="errorを入力" autofocus />
        </div>
        <div class="sidebar-btn">
            <button
                on:click={() => {
                    state = { page: "show" };
                }}
            >
                一覧を表示
            </button>
        </div>
        <div class="sidebar-btn">
            <button
                on:click={() => {
                    state = { page: "show" };
                }}
            >
                エラーポストを作成
            </button>
        </div>
    {:else if state.page === "show"}
        <h1>Show</h1>
        <button
            on:click={() => {
                state = { page: "search" };
            }}
        >
            searchへ
        </button>
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
    .search-input {
        margin-top: 1rem;
        margin-bottom: 2rem;
    }
    .sidebar-btn {
        margin-bottom: 1rem;
    }
</style>
