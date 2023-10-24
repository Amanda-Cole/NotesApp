/* eslint-disable react-refresh/only-export-components */
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { Note } from "./App"

type NoteLayoutProps = {
    notes: Note[]
}
// Sets unique id to note through React useParams
export function NoteLayout({ notes}: NoteLayoutProps) {
    const {id} = useParams()
    const note = notes.find(n => n.id === id)

    if (note == null) return <Navigate to ="/" replace/>

    return <Outlet context = {note}/>
}

export function useNote() {
    return useOutletContext<Note>() 
}