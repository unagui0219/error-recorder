<script lang="ts">
    let posts = Object.entries(postData);
    console.log(posts);
    const toShow = async (i: any) => {
        await tsvscode.postMessage({ type: "showPost", value: i });
    };
    const toEdit = async (i: any) => {
        console.log(`Viewindexのi: ${i}`);
        await tsvscode.postMessage({ type: "editPost", value: i });
    };
    const removePost = async (i: any) => {
        await tsvscode.postMessage({ type: "removePost", value: i });
    };
</script>

<div class="page-box">
    <div class="title-box">
        <h1>エラーポスト一覧</h1>
        <hr />
    </div>

    {#each posts as post}
        <div class="post-box">
            <div class="post-box_content">
                <h2 class="title">{post[1].title}</h2>
                <p><span>使用言語：</span>{post[1].lang}</p>
                <p><span>解決策：</span>{post[1].solutionCode}</p>
            </div>
            <div class="post-box_button_box">
                <button class="big-btn" on:click={() => toShow(post[0])}
                    >詳細を見る</button
                >
                <button on:click={() => toEdit(post[0])}>編集</button>
                <button class="delete-btn" on:click={() => removePost(post[0])}
                    >削除</button
                >
            </div>
        </div>
    {/each}
</div>

<style>
    .page-box {
        padding: 2rem 10% 0;
    }
    .title-box {
        margin-top: 1rem;
        margin-bottom: 2rem;
        color: #c7254e;
    }
    .title-box h1 {
        font-size: 3rem;
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
        font-size: 1.5rem;
        padding-bottom: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
