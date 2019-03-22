import React, { Component } from 'react';
import './App.scss';
import { Editor } from './core/Editor';

const str = `/**
 * test
 */
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="my-editor">
            <Editor setting={{language: 'ts'}} />
        </div>
      </div>
    );
  }
}

export default App;`;

/**
 * test
 */
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="my-editor">
            <Editor setting={{language: 'tsx'}} value={str} />
        </div>
      </div>
    );
  }
}

export default App;
