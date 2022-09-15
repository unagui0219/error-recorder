<script lang="ts">
    import PageTitle from "../ui/PageTitle.svelte";
    import axios from "axios";
    export let toSearch: () => void;

    type PostDataObject = {
        error_title: string;
        solution_code: string;
        source_code: string;
        lang: string;
    };

    type PostLocalDataObject = {
        title: string;
        solutionCode: string;
        sourceCode: string;
        lang: string;
        password_digest: any;
    };

    const postUrl: string = "http://localhost:3000/api/v1/posts";
    let isSubmitting = false;
    let errorTitle: string;
    let errorSourceCode: string;
    let errorSolutionCode: string;
    let lang: string;
    let online = true;
    

    export const handleSubmit = async () => {
        isSubmitting = true;
        let passwordDigest = null;

        // request body
        const postErrorData: PostDataObject = {
            error_title: errorTitle,
            solution_code: errorSourceCode,
            source_code: errorSolutionCode,
            lang: lang,
        };
        if (online) {
            let axiosData = await get_password_digest(postUrl, postErrorData);
            setTimeout(() => {
                isSubmitting = false;
            }, 1000);
            passwordDigest = axiosData;
        };

        const PostLocalDataObject: PostLocalDataObject = {
            title: errorTitle,
            solutionCode: errorSourceCode,
            sourceCode: errorSolutionCode,
            lang: lang,
            password_digest: passwordDigest,
        };

        //Post時にその投稿のpassword_digestを他のデータと一緒に保存して、それをキーにして実装
        await tsvscode.postMessage({
            type: "savePost",
            value: PostLocalDataObject,
        });
        isSubmitting = false;
        toSearch();
    };

    function get_password_digest(url: string, obj: PostDataObject) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, obj)
                .then(res => {
                    let password_digest = res.data["data"]["post"]["password_digest"];
                    resolve(password_digest);
                })
                .catch(err => {
                    reject(err);
                });
        });

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
                bind:checked={online}
            />
            <label for="online_flag">オンラインにアップロードする</label>
            <button disabled={isSubmitting}>保存する</button>
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
