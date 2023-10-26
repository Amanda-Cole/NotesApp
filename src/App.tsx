import"bootstrap/dist/css/bootstrap.min.css"
import './App.css'
import { Routes, Route, Navigate} from "react-router-dom"
import { Container } from "react-bootstrap"
import { NewNote } from "./NewNote"
import { useLocalStorage } from "./useLocalStorage"
import { useMemo } from "react"
import { v4 as uuidV4 } from "uuid"
import { NoteList } from "./NoteList"
import { NoteLayout } from "./NotesLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"

export type Note = {
  id: string
} & NoteData

export type RawNote = {
  id: string
}  & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

//useLocalStorage to create Notes and tags, inside APP function is onCreateNote, onUpdateNote, and onDeleteNote, also addTag, editTag, and deleteTag
function App() {
    const [notes,setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
    const [tags,setTags] = useLocalStorage<Tag[]>("TAGS", [])

    const notesWithTags = useMemo(() => {
      return notes.map(note => {
        return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
      })
    },[notes, tags])

    function onCreateNote({ tags, ...data }: NoteData){
      setNotes (prevNotes => {
        return [...prevNotes, {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }]

      })
    }

    function onUpdateNote(id: string, { tags, ...data }: NoteData) {
      setNotes(prevNotes => {
        return prevNotes.map(note => {
          if (note.id === id) {
            return { ...note, ...data, tagIds: tags.map(tag => tag.id) }
          } else {
            return note
          }
        })
      })
    }
      function onDeleteNote(id: string){
      setNotes(prevNotes => {
        return prevNotes.filter(note => note.id !== id)
      })
    }


    function addTag(tag: Tag){
      setTags(prev => [...prev, tag])
    }

    function updateTag(id: string, label: string){
      setTags(prevTags => {
        return prevTags.map(tag => {
          if (tag.id ===id){
            return {...tag, label }
          }else {
            return tag
          }
        })
      })
    }

    function deleteTag(id: string){
      setTags(prevTags=> {
        return prevTags.filter((tag: { id: string }) => tag.id !== id)
      })
    }

    return (
      <Container className="my-4">
      {/* create Navigation for pages  home, create, show, and edit */}
        <Routes>
          <Route 
            path="/" 
           element = {<NoteList notes={notesWithTags} 
           availableTags={tags}
           onUpdateTag = {updateTag}
           onDeleteTag = {deleteTag}/>}
           />
          <Route 
            path="/new" 
            element = {
              <NewNote 
                onSubmit={onCreateNote} 
                onAddTag={addTag} 
                availableTags = {tags}
                />
              }
            />
          <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
            <Route index element={<Note onDelete={onDeleteNote} />} />
            <Route
              path="edit"
              element={
                <EditNote
                  onSubmit={onUpdateNote}
                  onAddTag={addTag}
                  availableTags={tags}
              />
            }
          />
          </Route>
          <Route path="*" element = {<Navigate to = "/"/>}/>
        </Routes>
      </Container>
  )
}
export default App



















//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

