import React, {useState} from 'react';
import './App.css';

function App() {
  var [currentQuestion, setCurrentQuestion] = useState("");
  var [currentQuestioner, setCurrentQuestioner] = useState("");
  var [previewQuestion, setPreviewQuestion] = useState("");
  var [previewQuestioner, setPreviewQuestioner] = useState("");

  return (
    <div className="App">
     <div className="Controls">
        <label>
          Sheet ID:
         <input className="Sheet_ID_Box" type="text" name="preview" />
        </label>
        <label>
          Preview Question Number:
         <input className="Preview_Question_Number_Box" type="text" name="preview" defaultValue="1" />
        </label>
      <button onClick={function() {
        var fetchString = "http://localhost:5000/?question=" + document.getElementsByClassName("Preview_Question_Number_Box")[0].value + "&id=" + document.getElementsByClassName("Sheet_ID_Box")[0].value
        fetch(fetchString).then(response =>
         response.json().then(data => {
            setPreviewQuestioner(data.values[0][0]);
            setPreviewQuestion(data.values[0][1]);
          })
        );
        }}>
        Submit
      </button>
      <button onClick={function() {
        document.getElementsByClassName("Preview_Question_Number_Box")[0].value = parseInt(document.getElementsByClassName("Preview_Question_Number_Box")[0].value) + 1
        var fetchString = "http://localhost:5000/?question=" + document.getElementsByClassName("Preview_Question_Number_Box")[0].value + "&id=" + document.getElementsByClassName("Sheet_ID_Box")[0].value
        fetch(fetchString).then(response =>
         response.json().then(data => {
            setPreviewQuestioner(data.values[0][0]);
            setPreviewQuestion(data.values[0][1]);
          })
        );
        }}>
        Skip
      </button>
      <button className="Answer_Button" onClick={function() {
        setCurrentQuestioner(document.getElementsByClassName("previewQuestioner")[0].textContent);
        setCurrentQuestion(document.getElementsByClassName("previewQuestion")[0].textContent);
        document.getElementsByClassName("Preview_Question_Number_Box")[0].value = parseInt(document.getElementsByClassName("Preview_Question_Number_Box")[0].value) + 1
        var fetchString = "http://localhost:5000/?question=" + document.getElementsByClassName("Preview_Question_Number_Box")[0].value + "&id=" + document.getElementsByClassName("Sheet_ID_Box")[0].value
        fetch(fetchString).then(response =>
         response.json().then(data => {
            setPreviewQuestioner(data.values[0][0]);
            setPreviewQuestion(data.values[0][1]);
          })
        );
        }}>
        Answer
      </button>
     </div>
     <div className="Preview">
      <div className="previewQuestioner">{previewQuestioner}</div>
      <div className="previewQuestion">{previewQuestion}</div>
     </div>
     <div className="Live">
      <div className="currentQuestioner">{currentQuestioner}</div>
      <div className="currentQuestion">{currentQuestion}</div>
     </div>
    </div>
  );
}

export default App;
