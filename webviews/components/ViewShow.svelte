<script lang="ts">
	let post = postOneData[1];
</script>

<div class="page-box">
	<div class="title-box">
		<h1>エラー内容</h1>
	</div>
	<div class="top-block">
		<div class="error-title-box">
			<h2>{post.title}</h2>
			<p><span>使用言語：</span>{post.lang}</p>
		</div>
		<div class="btn-box_cover">
			<div class="btn-box">
				<button>編集</button>
				<button class="delete-btn">削除</button>
			</div>
		</div>
	</div>
	<div class="bottom-block">
		<div class="bottom-block_section">
			<h3>ソースコード</h3>
			<hr />
			<p>{post.sourceCode}</p>
		</div>
		<div class="bottom-block_section">
			<h3>解決策</h3>
			<hr />
			<p>{post.solutionCode}</p>
		</div>
	</div>
</div>

<style>
	.page-box {
		padding: 2rem 10% 0;
	}

	.top-block {
		margin-bottom: 2rem;
	}
	.error-title-box h2 {
		font-size: 2.3rem;
		margin-bottom: 1rem;
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
	.btn-box_cover {
		display: flex;
		justify-content: end;
	}
	.btn-box {
		display: flex;
		width: 30%;
	}
	.btn-box button {
		margin-left: 1rem;
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
