import React, { Component } from 'react';
import { Editor } from './editor/Editor';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="my-editor">
            <Editor value={`test\n\ntest`}/>
        </div>
      </div>
    );
  }
}

export default App;
