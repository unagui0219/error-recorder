<script lang="ts">
    import PageTitle from "../ui/PageTitle.svelte";
    import axios from "axios";
    import type { PostData, LocalDataObj } from "../common/types";
    export let toSearch: () => void;

    const postUrl: string = "http://localhost:3000/api/v1/posts";
    let isSubmitting: boolean = false;
    let online: boolean = true;
    let errorTitle: string;
    let errorSourceCode: string;
    let errorSolutionCode: string;
    let lang: string;

    export const handleSubmit = async () => {
        isSubmitting = true;
        let resUniqueData: any = [];

        // request body
        const postOnlineData: PostData = {
            errorTitle: errorTitle,
            sourceCode: errorSourceCode,
            solutionCode: errorSolutionCode,
            lang: lang,
        };

        if (online) {
            let axiosData = await getUniqueFromOnlineData(postUrl, postOnlineData);
            resUniqueData = axiosData;
        };

        const postLocalData: LocalDataObj = {
            errorTitle: errorTitle,
            solutionCode: errorSourceCode,
            sourceCode: errorSolutionCode,
            lang: lang,
            password: resUniqueData[1],
            id: resUniqueData[0],
        };

        await tsvscode.postMessage({
            type: "savePost",
            value: postLocalData,
        });
        setTimeout(() => {
            isSubmitting = false;
        }, 1000);
        toSearch();
    };

    const getUniqueFromOnlineData = (url: string, obj: PostData) => {
        return new Promise((resolve, reject) => {
            axios
                .post(url, obj)
                .then(res => {
                    const uniqueData: any[] = [];
                    let id = res.data["data"]["post"]["id"];
                    let password = res.data["data"]["pass"];
                    uniqueData.push(id, password);
                    resolve(uniqueData);
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
                required
                autofocus
            />
            <textarea
                id="error-source-code"
                class="post-input post-text"
                name="error-source-code"
                bind:value={errorSourceCode}
                required
                placeholder="エラーのソースを入力"
            />
            <textarea
                id="error-solution-code"
                class="post-input post-text"
                name="error-solution-code"
                bind:value={errorSolutionCode}
                required
                placeholder="解決用のコードを入力"
            />
            <input
                id="error-lang"
                class="post-input"
                type="text"
                name="error-lang"
                bind:value={lang}
                required
                placeholder="言語を入力"
            />
            <input
                id="online_flag"
                class="post-input"
                type="checkbox"
                required
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
