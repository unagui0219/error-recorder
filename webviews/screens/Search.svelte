<script lang="ts">
    import PageTitle from "../ui/PageTitle.svelte";
    export let toCreate: () => void;
    export let toShow: () => void;
</script>

<div>
    <PageTitle title={"エラー検索"} />
    <div class="search-input">
        <!-- svelte-ignore a11y-autofocus -->
        <input type="text" placeholder="errorを入力" autofocus />
    </div>
    <div class="sidebar-btn">
        <button on:click={toShow}> 一覧を表示 </button>
    </div>
    <div class="sidebar-btn">
        <button on:click={toCreate}> エラーポストを作成 </button>
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
