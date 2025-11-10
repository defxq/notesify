import apiSlice from "../../app/api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const notesAdapter = createEntityAdapter();

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotes: builder.query({
            query: () => ({
                url: "/notes",
            }),
            providesTags: ["Note"],
            transformResponse: responseData => {
                const loadedNotes = responseData.map(note => {
                    note.id = note._id;
                    return note;
                });
                return notesAdapter.setAll(initialState, loadedNotes);
            }
        }),
        addNewNote : builder.mutation({
            query: (data) => ({
                url: "/notes",
                method: "POST",
                body:  data
            }),
            invalidatesTags: ["Note"],
        }),
        updateNote: builder.mutation({
            query: (data) => ({
                url: "/notes",
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["Note"],
        }),
        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: "/notes",
                method: "DELETE",
                body: { id }
            }),
            invalidatesTags: ["Note"],
        }),
    })
});


export const {
    useGetNotesQuery,
    useLazyGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation, 
} = notesApiSlice;

const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

const selectNotesData = createSelector(
    selectNotesResult,
    (notesResult) => notesResult.data
);

export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selctNoteIds
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState);