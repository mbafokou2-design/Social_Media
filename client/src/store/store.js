import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./user-slice"
import uiSlice from "./ui-slice"
import postsSlice from "./posts-slice"  // ✅ added

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        ui: uiSlice.reducer,
        posts: postsSlice.reducer  // ✅ added
    }
})

export default store