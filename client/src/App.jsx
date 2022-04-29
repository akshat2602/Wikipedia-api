import "./App.css";
import Projects from "./views/Projects";
import ProjectView from "./views/ProjectView";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [languages, setLanguages] = useState([]);
 
  const fetchLanguages = async () => {
    const response = await axios.get(
      "http://localhost:8000/languages/"
    );
    console.log(response.data);
    setLanguages(response.data);
  };
  useEffect(() => {
    
    fetchLanguages();
  }, []);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Projects
              languages={languages}
            />
          </Route>
          <Route path="/projects/:projectID">
            <ProjectView />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
