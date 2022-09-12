<script lang="ts">
    let posts = Object.entries(postData);
    const toShow = async (i: any) => {
        await tsvscode.postMessage({ type: "showPost", value: i });
    };
</script>

<div class="title-box">
    <h1>Error Recorder List</h1>
    <hr />
</div>

{#each posts as post}
    <div class="post-box">
        <div class="post-box_content">
            <h2 class="title">{post[1].title}</h2>
            <p><span>解決策：</span>{post[1].solutionCode}</p>
        </div>
        <div class="post-box_button_box">
            <button class="big-btn" on:click={() => toShow(post[0])}
                >詳細を見る</button
            >
            <button>編集</button>
            <button class="delete-btn">削除</button>
        </div>
    </div>
{/each}

<style>
    .title-box {
        margin-top: 1rem;
        margin-bottom: 2rem;
        color: #c7254e;
    }
    .post-box {
        border: 2px solid white !important;
        padding: 1rem;
        margin-bottom: 2rem;
    }
    .post-box_content {
        margin-bottom: 1rem;
    }
    .post-box_content h2 {
        font-size: 2rem;
        padding-bottom: 1rem;
    }
    .post-box_content span {
        font-weight: bold;
    }
    .post-box_button_box {
        text-align: right;
    }
    .post-box_button_box button {
        width: 3rem;
        margin-right: 1rem;
    }
    .big-btn {
        width: 6rem !important;
    }
    .delete-btn {
        background-color: #c7254f !important;
    }
    .delete-btn:focus {
        outline-color: #c7254f !important;
    }
    .delete-btn:hover {
        cursor: pointer;
        background: #d7254f !important;
    }
</style>
