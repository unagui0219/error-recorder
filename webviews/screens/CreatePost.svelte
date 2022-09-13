<script lang="ts">
    import PageTitle from "../ui/PageTitle.svelte";
    import axios from 'axios';

    type PostDataObject = {
        error_title: string;
        solution_code: string;
        source_code: string;
        lang: string;
    };

    const postUrl: string = 'http://localhost:3000/api/v1/posts';
    let isSubmitting = false;
    let errorTitle: string;
    let errorSourceCode: string;
    let errorSolutionCode: string;
    let lang: string;

    export const handleSubmit = () => {
        isSubmitting = true;

        // request body
        const postErrorData: PostDataObject = {
            error_title: errorTitle,
            solution_code: errorSourceCode,
            source_code: errorSolutionCode,
            lang: lang
        };
        postAxios(postUrl, postErrorData);
        setTimeout(() => {
            isSubmitting = false
        }, 1000);
    };

    function postAxios(url: string, obj: PostDataObject) {
        axios.post(url, obj)
            .then(res => {
                return res;
            }).catch(err => {
                console.log("err:", err);
            });
    };

    const testdata = {
        title: "error1",
        solutionCode: "Foo1",
        sourceCode: "Foo1",
        lang: "Ruby",
    };
    const savePost = async () => {
        await tsvscode.postMessage({ type: "savePost", value: testdata });
    };
</script>

<div>
    <PageTitle title="エラーポストを作成" />
    <div class="post-form">
        <form on:submit|preventDefault={handleSubmit}>
            <!-- svelte-ignore a11y-autofocus -->
            <input
                id="error-title"
                class="post-input"
                type="text"
                name="errorTitle"
                bind:value={errorTitle}
                placeholder="エラータイトルを入力"
                autofocus
            />
            <textarea
                id="error-source-code"
                class="post-input post-text"
                name="error-source-code"
                bind:value={errorSourceCode}
                placeholder="エラーのソースを入力"
            />
            <textarea
                id="error-solution-code"
                class="post-input post-text"
                name="error-solution-code"
                bind:value={errorSolutionCode}
                placeholder="解決用のコードを入力"
            />
            <input
                id="error-lang"
                class="post-input"
                type="text"
                name="error-lang"
                bind:value={lang}
                placeholder="言語を入力"
            />
            <input
                id="online_flag"
                class="post-input"
                type="checkbox"
                checked 
            />
            <label for="online_flag">オンラインにアップロードする</label>
            <button on:click={savePost} disabled={isSubmitting}>保存する</button>
        </form>
    </div>
</div>

<style>
    .post-input {
        margin-bottom: 1rem;
    }
    .post-text {
        height: 200px;
    }
    button:disabled {
        background: #ddd;
    }
</style>
