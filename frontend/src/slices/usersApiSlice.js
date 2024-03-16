import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: USERS_URL,
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            }),
        }),
        signup: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/signup`,
                method: "POST",
                body: data,
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: "PUT",
                body: data,
            }),
        }),
        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,
            }),
            providedTags: ["Users"],
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: "DELETE",
            }),
        }),
        getUserDetails: builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useSignupMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} = usersApiSlice;
