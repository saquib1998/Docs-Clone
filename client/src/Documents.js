import React, { useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from 'react';
import { v4 as uuidV4 } from "uuid"
import InputModal from './InputModal';



export default function Documents() {
    const [documents, setDocuments] = useState([])
    const { user } = useAuth0();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documentName, setDocumentName] = useState('');
  
  const handleCreateDocument = () => {
    const newDocumentId = uuidV4();
    if(documentName == '') return    
    // Redirect to the new document page with both ID and name as query parameters
    navigate(`/documents/${newDocumentId}/${documentName}`);
  };

    useEffect(() => {
        if(user == null) return
        fetch(`http://localhost:3001/documents/${user.email}`).
        then(response => {
            if(response.ok){
                return response.json()
            } 
        })
        .then(data => {
            setDocuments(data)
        })
        .catch(error => console.log(error))
    }, [user])
    
    
    if(!user){
        return <Navigate replace to="/" />;
    }

  return (
    <div>
        <button onClick={() => setIsModalOpen(true)}>Create a New Document</button>
        <ul>
            {/* <li><Link to={`/documents/${uuidV4()}`}>Create a new Document</Link></li> */}
            { documents.map((document, index) => (
                <li key={index}><Link to={`/documents/${document._id}/${document.name}`}>{document.name}</Link></li>
            ))}
        </ul>

        <InputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(name) => {
          setDocumentName(name);
          handleCreateDocument();
        }}
      />
        
        
    </div>
  )
}
