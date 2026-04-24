import { createSlice } from "@reduxjs/toolkit"

const postsSlice = createSlice({
    name: "posts",
    initialState: { posts: [] },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload
        },
        addPost: (state, action) => {
            state.posts = [action.payload, ...state.posts]
        },
        updatePost: (state, action) => {
            state.posts = state.posts.map(post =>
                post._id === action.payload._id ? action.payload : post
            )
        },
        deletePost: (state, action) => {
            state.posts = state.posts.filter(post => post._id !== action.payload)
        }
    }
})

export const postsActions = postsSlice.actions
export default postsSlice