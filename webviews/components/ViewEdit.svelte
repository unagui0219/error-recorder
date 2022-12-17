<script lang="ts">
	import axios from "axios";
	export let toSearch: () => void;
	let postkey = postOneData[0];
	let post = postOneData[1];

	type PutDataObject = {
		error_title: string;
		solution_code: string;
		source_code: string;
		lang: string;
  };

	type PutLocalDataObject = {
		title: string;
		solutionCode: string;
		sourceCode: string;
		lang: string;
  };

	const putUrl: string = `http://localhost:3000/api/v1/posts/${post.id}`;
	let isSubmitting = false;
	let errorTitle: string;
	let errorSourceCode: string;
	let errorSolutionCode: string;
	let lang: string;
	let online = true;
	
	errorTitle = post.title;
	errorSourceCode = post.sourceCode;
	errorSolutionCode = post.solutionCode;
	lang = post.lang;

	export const handleSubmit = async () => {
		isSubmitting = true;

		// request body
		const putErrorData: PutDataObject = {
			error_title: errorTitle,
			solution_code: errorSourceCode,
			source_code: errorSolutionCode,
			lang: lang,
		};

		if (online) {
			axios.put(putUrl, putErrorData, {
				params: {
					password: post.password,
				}
			})
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			});
		};

		const PutLocalDataObject: PutLocalDataObject = {
			title: errorTitle,
			solutionCode: errorSourceCode,
			sourceCode: errorSolutionCode,
			lang: lang,
    };
		
		await tsvscode.postMessage({
			type: "updatePost",
			value: PutLocalDataObject,
			postKey: postkey,
		});
		setTimeout(() => {
			isSubmitting = false;
		}, 1000);
		toSearch();
  };
</script>

<div class="page-box">
	<form on:submit|preventDefault={handleSubmit}>
		<div class="title-box">
			<h1>編集：エラー内容</h1>
		</div>
		<div class="top-block">
			<div class="error-title-box">
				<h3>エラータイトル</h3>
				<input
					class="post-input"
					type="text"
					name="errorTitle"
					bind:value={errorTitle}
				/>
				<p><span>使用言語</span>
					<input
						class="post-input"
						type="text"
						name="lang"
						bind:value={lang}
					/>
				</p>
			</div>
		</div>
		<div class="bottom-block">
			<div class="bottom-block_section">
				<h3>ソースコード</h3>
				<textarea
					class="post-input post-text"
					name="errorSourceCode"
					bind:value={errorSourceCode}
				/>
			</div>
			<div class="bottom-block_section">
				<h3>解決策</h3>
				<textarea
					class="post-input post-text"
					name="errorSolutionCode"
					bind:value={errorSolutionCode}
				/>
			</div>
		</div>
		<input
			id="online_flag"
			class="post-input"
			type="checkbox"
			bind:checked={online}
		/>
		<label for="online_flag">オンラインにアップロードする</label>
		<button disabled={isSubmitting}>更新する</button>
	</form>
</div>
<style>
	.page-box {
		padding: 2rem 10% 0;
	}
	.top-block {
		margin-bottom: 2rem;
	}
	.bottom-block_section {
		margin-bottom: 2rem;
	}
	.bottom-block_section h3 {
		font-size: 1.8rem;
	}
	.title-box {
		margin-top: 1rem;
		margin-bottom: 2rem;
		color: #c7254e;
	}
	.title-box h1 {
		font-size: 3rem;
	}
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
