<script lang="ts">
    import PageTitle from "../ui/PageTitle.svelte";
</script>

<div>
    <PageTitle title="エラーポストを作成" />
    <div class="post-form">
        <!-- svelte-ignore a11y-autofocus -->
        <input
            class="post-input"
            type="text"
            placeholder="エラータイトルを入力"
            autofocus
        />
        <textarea
            class="post-input post-text"
            placeholder="エラーのソースを入力"
        />
        <textarea
            class="post-input post-text"
            placeholder="解決用のコードを入力"
        />
        <input class="post-input" type="text" placeholder="言語を入力" />
        <button>保存する</button>
    </div>
</div>

<style>
    .post-input {
        margin-bottom: 1rem;
    }
    .post-text {
        height: 200px;
    }
</style>
