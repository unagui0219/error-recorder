<script lang="ts">
    import PageTitle from "../ui/PageTitle.svelte";
    export let toCreate: () => void;
    $: searchBox = "";
    $: notFound = false;
    const posts = Object.entries(postData);
    const toIndex = async () => {
        await tsvscode.postMessage({
            type: "startViewIndex",
            dataType: "all",
            value: posts,
        });
    };

    export const search = async () => {
        notFound = false;
        let results: any;
        results = posts.flatMap((v) => {
            if (v[1].title.toLowerCase().includes(searchBox.toLowerCase())) {
                return v;
            } else {
                return [];
            }
        });
        if (results.length) {
            const resultsFormatted = new Map<string, {}>();
            for (var i = 0; i < results.length; i = i + 2) {
                resultsFormatted.set(results[i], results[i + 1]);
            }
            let objResult = Object.fromEntries(resultsFormatted);

            await tsvscode.postMessage({
                type: "startViewIndex",
                dataType: "search",
                value: objResult,
            });
        } else {
            notFound = true;
        }
    };

    // $: if (postData.indexOf(searchBox)) {
    //     async () => {
    //         await tsvscode.postMessage({ type: "startViewIndex" });
    //     };
    // } else {
    // }
</script>

<div>
    <PageTitle title={"エラー検索"} />
    <div class="search-input">
        <!-- svelte-ignore a11y-autofocus -->
        <form on:submit|preventDefault={search}>
            <input
                type="search"
                placeholder="errorを入力"
                bind:value={searchBox}
                autofocus
            />
        </form>
    </div>
    {#if notFound}
        <div id="search-error">検索結果がありません。</div>
    {/if}
    <div class="sidebar-btn">
        <button on:click={toIndex}> エラーポスト一覧 </button>
    </div>
    <div class="sidebar-btn">
        <button on:click={toCreate}> エラーポスト作成 </button>
    </div>
</div>

<style>
    .search-input {
        margin-top: 1rem;
        margin-bottom: 2rem;
    }
    .sidebar-btn {
        margin-bottom: 1rem;
    }
</style>
