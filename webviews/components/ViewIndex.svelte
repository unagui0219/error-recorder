<script lang="ts">
    let users = [
        {
            title: "Taro2",
            solution_code: "rails s",
            source_code: "dkamkldnjwbdbnejbfheabjkndjkan",
        },
        {
            title: "Hana",
            solution_code:
                "raaaaaaaaaaamkmkmkmkmknfelwjfkjhewuinfuewnunfinmaklnfiewnahfunkjanklfjnasijfiwjnoi",
            source_code: "dkamkldnjwbdbnejbfheabjkndjkan",
        },
        {
            title: "Ken",
            solution_code:
                "daidjkabhjfbewjbfhjlbsfbdksbghv dfhbfkbewulhfijebhjfeiuajhkldfsnkjnfksmfknjeskbfm nmambfjkbneasnm jkueahu",
            source_code: "dkamkldnjwbdbnejbfheabjkndjkan",
        },
    ];
</script>

{#each users as user}
    <div class="post-box">
        <div class="post-box_content">
            <h2 class="title">{user.title}</h2>
            <p><span>解決策：</span>{user.solution_code}</p>
        </div>
        <div class="post-box_button_box">
            <button class="big-btn">詳細を見る</button>
            <button>編集</button>
            <button>削除</button>
        </div>
    </div>
{/each}

<style>
    .post-box {
        border: 2px solid white !important;
        padding: 1rem;
        margin-bottom: 2rem;
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
    h2 {
        font-size: 2rem;
    }
</style>
