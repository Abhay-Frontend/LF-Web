import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import modalReducer from "./slices/loginmodalSlice";
import searchReducer from "./slices/searchSlice";
import loadingReducer from "./slices/loadingSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  modal: modalReducer,
  search: searchReducer,
  loading: loadingReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "user", "modal", "search"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// ✅ Export persistor
export const persistor = persistStore(store);
// export const store = configureStore({
//   reducer: rootReducer,  for fixing redux persist error uncomment this and comment persist
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
// });

