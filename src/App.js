import React, { useState,useEffect } from 'react';
import './App.css';
import Preview from'./components/Preview';
import Message from './components/message';
import NotesContainer from './components/Notes/NotesContainer';
import NoteList from './components/Notes/NotesList';
import Note from './components/Notes/Note';
import NoteForm from './components/Notes/NoteForm';
import Alert from './components/Alert';

function App() {
   const [notes,setNotes] = useState([]);
   const [title,setTitle] = useState ('');
   const [content,setContent] = useState ('');
   const [selectednote,setSelectednote] = useState(null);
   const [creating,setCreating] = useState(false);
   const [editing,setEditing] =useState(false);
   const [validationErrors,setValidationErrors]=useState([]);

   //
   useEffect(() =>{
    if(localStorage.getItem('notes')){
      setNotes(JSON.parse(localStorage.getItem('notes')));
      }else{
        localStorage.setItem('notes',JSON.stringify([]));
      }
   },[]);

   useEffect(() =>{
    if(validationErrors.length !==0){
      setTimeout(() => {
        setValidationErrors([]);
      }, 3000)
    }
   },[validationErrors])

   const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key,JSON.stringify(value));
   };

   const validate =() =>{
    const validationErrors =[];
    let passed =true;
    if(!title){
      validationErrors.push("الرجاء ادخال عنوان الملاحظة");
      passed=false;
    }

    if(!content){
      validationErrors.push("الرجاء ادخال محتوى الملاحظة");
      passed=false;
    }
    setValidationErrors(validationErrors);
    return passed;
   }

   //  تغيير عنوان الملاح
const changeTitleHandler =(event) => {
  setTitle(event.target.value);
}
// تغيير محتوى الملاحضة

const changeContentHandler =(event) => {
  setContent(event.target.value);
} 
//حفظ الملاحضة
const saveNoteHandler = () =>{
  if (!validate()) return;
    const note ={
    id : new Date(),
    title :title ,
    content : content
  }

  const updateNotes=[...notes,note];
 
  saveToLocalStorage('notes',updateNotes);
  setNotes(updateNotes);
  setCreating(false);
  setSelectednote(note.id);
  setTitle('');
  setContent('');
}
 // اختيار ملاحضة
const selectNoteHandler = noteId =>{
  setSelectednote(noteId);
  setCreating(false);
  setEditing(false);
}

//الانتقال الى وضع التعديل

const editeNotehandler = () =>{
  const note =notes.find(note=> note.id === selectednote);
  setEditing(true);
  setTitle(note.title);
  setContent(note.content);
} 

// تعديل ملاحضة
const updateNoteHandler = ()=>{
  if (!validate()) return;
   const updatedNotes = [...notes];
   const noteIndex =notes.findIndex(note =>note.id === selectednote);
   updatedNotes[noteIndex] ={
    id: selectednote,
    title: title,
    content: content
   };

saveToLocalStorage('notes',updatedNotes);
setNotes(updatedNotes);
setEditing(false);
setTitle('');
setContent('');

}
//الانتقال الى واجهة اضافة ملاحظة
const addNoteHandler = ()=>{
  setCreating(true);
  setEditing(false);
  setTitle('');
  setContent('');
}

//حذف ملاحظة
const deleteNoteHandler = () => {
  const updatedNotes = [...notes];
  const noteIndex = updatedNotes.findIndex(note => note.id === selectednote);
  notes.splice(noteIndex,1);
  saveToLocalStorage('notes',notes);
  setNotes(notes);
  setSelectednote(null);
}
const getAddNote = () => {
    return (
      <NoteForm 
      formTitle="ملاحظة جديدة"
      title={title}
      content={content}
      titleChange={changeTitleHandler}
      contentChange={changeContentHandler}
      submitText="حفظ"
      submitClicked={saveNoteHandler}
      />
    );
  };

  const getPreview = () => {
    if(notes.length === 0){
      return <Message title="لا يوجد ملاحضة"/>
    }

    if(!selectednote){
      return <Message title="الرجاءاختيار ملاحضة"/>
     }

     const note =notes.find(note => {
      return note.id === selectednote;
     });


     let noteDesplay =(
      <div>
        <h1>{note.title}</h1>
        <p>{note.content}</p>
      </div>
     )

     if (editing) 
     {
      noteDesplay=(
        <NoteForm 
         formTitle="تعديل ملاحظة"
         title={title}
         content={content}
         titleChange={changeTitleHandler}
         contentChange={changeContentHandler}
         submitText="تعديل"
         submitClicked={updateNoteHandler}
        />
      );
     }

    return (
      <div>
        {!editing &&
          <div className="note-operations">
            <a href="#" onClick={editeNotehandler}>
             <i className="fa fa-pencil-alt" />
            </a>
            <a href="#" onClick={deleteNoteHandler}>
             <i className="fa fa-trash" />
            </a>
        </div>
        }
        
         {noteDesplay}
      </div>
    );
  };

  
  return (
    <div className="App">
      <NotesContainer>
       <NoteList>
          {notes.map(note => <Note key={note.id}
           title={note.title} 
           noteClicked={() => selectNoteHandler(note.id)}
           active={selectednote === note.id}
           />)}
        </NoteList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </NotesContainer>
      <Preview>
      {creating ? getAddNote() : getPreview()}
      </Preview>
      {validationErrors.length !==0 && <Alert validationMessages={validationErrors}/>}
    </div>
  );
}

export default App;
