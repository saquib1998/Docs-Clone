import TextEditor from "./TextEditor"
import Home from "./Home"
import Documents from "./Documents"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"


function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/documents" exact element={<Documents />} />        
      <Route path="/documents/:id/:name" element={<TextEditor />}/>
    </Routes>
  </Router>
  );
}

export default App;
