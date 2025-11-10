import apiSlice from "../../app/api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => "/users",
            providesTags: ["User"],
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id;
                    return user;
                });
                return usersAdapter.setAll(initialState, loadedUsers);
            }
        }),
        addNewUser : builder.mutation({
            query: (data) => ({
                url: "/users",
                method: "POST",
                body:  data
            }),
            invalidatesTags: ["User"],
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: "/users",
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: "/users",
                method: "DELETE",
                body: { id }
            }),
            invalidatesTags: ["User"],
        }),

    })
});


export const {
    useGetUsersQuery,
    useLazyGetUsersQuery,
    useAddNewUserMutation,
    useDeleteUserMutation,
    useUpdateUserMutation
} = usersApiSlice;


const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(
    selectUsersResult,
    (usersResult) => usersResult?.data ?? initialState
);

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selctUserIds
} = usersAdapter.getSelectors(state => selectUsersData(state));

