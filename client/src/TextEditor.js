import React, { useCallback, useEffect, useRef, useState } from 'react'
import Quill  from 'quill'
import "quill/dist/quill.snow.css"
import {io} from 'socket.io-client'
import {useParams} from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]

export default function TextEditor() {
    const { id: documentId, name } = useParams()
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const { user } = useAuth0();

    useEffect(() => {
        const socket = io("http://localhost:3001")
        setSocket(socket)
        return () => {
            console.log('disconnected')
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        if(quill == null || socket == null || user == null) return; 
        socket.once('load-document', document => {
            quill.setContents(document);
            quill.enable();
        })
        socket.emit('get-document', documentId, user.email, name)
    }, [socket, quill, documentId, user])

    useEffect(() => {
        if(quill == null || socket == null) return;

        const handler = delta => quill.updateContents(delta)     

        socket.on('recieve-changes', handler)

        return () => {
            socket.off('recieve-changes', handler)
        }

    }, [quill, socket])

    useEffect(() => {
        if(quill == null || socket == null) return;

        const handler = (delta, oldDelta, source) => {
            if(source !== 'user') return
            socket.emit('send-changes', delta);

        }

        quill.on('text-change', handler)

        return () => {
            quill.off('text-change', handler)
        }
    }, [quill, socket])

    useEffect(() => {
        if (socket == null || quill == null) return
    
        const interval = setInterval(() => {
          socket.emit("save-document", quill.getContents())
        }, SAVE_INTERVAL_MS)
    
        return () => {
          clearInterval(interval)
        }
      }, [socket, quill])



    const wrapperRef = useCallback((wrapper) => {
        if(wrapper == null) return;
        wrapper.innerHTML = ''
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {theme: 'snow', modules: {toolbar: TOOLBAR_OPTIONS}})
        q.enable(false)
        q.setText('Loading...')
        setQuill(q)
    }, [])
  return <div className='container' ref={wrapperRef}></div>
}
