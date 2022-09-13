export type State =
    | { page: "search" }
    | { page: "edit" }
    | { page: "create" }
    | { page: "show" }
    | { page: "loading" };