//Displays details of a note based on URL (e.g., /notes/2)
//useParams: get values from URL,e.g, /notes/2
import { useParams } from 'react-router-dom';

const NoteDetail = ({ notes }) => {
  const { id } = useParams(); //example, return { id: "2" }

  // find the note by id
  const note = notes.find(n => n.id === Number(id));

  if (!note) {
    return <h2>Note not found</h2>;
  }

  return (
    <div>
      <h2>Note Detail</h2>
      <p><strong>Content:</strong> {note.content}</p>
      <p><strong>User:</strong> {note.user}</p>
    </div>
  );
};

export default NoteDetail;