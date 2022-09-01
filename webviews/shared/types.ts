export type State =
    | { page: "search" }
    | { page: "edit" }
    | { page: "show" }
    | ReviewCodeImgsState
    | { page: "loading" };

export type ReviewCodeImgsState = {
    page: "review-code-imgs";
    codeImgIds: CodeImgIdItem[];
};

export type CodeImgIdItem = {
    value: string;
    tmpId: string;
};