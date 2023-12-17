import { useState } from "react";
import "./App.css";

function App() {
  const [fields, setFields] = useState([{ duration: 0, power: 0, pace: 0 }]);

  return (
    <div>
      <h1>Zwift ZWO Editor</h1>
      {fields.map((field) => (
        <div>
          <span>
            <label>Duration</label>
            <input
              type="text"
              value={field.duration}
              onChange={(e) => {
                const newFields = [...fields];
                newFields[0].duration = parseInt(e.target.value);
                setFields(newFields);
              }}
            />
          </span>
          <span>
            <label>Power</label>
            <input
              type="text"
              value={field.power}
              onChange={(e) => {
                const newFields = [...fields];
                newFields[0].power = parseInt(e.target.value);
                setFields(newFields);
              }}
            />
          </span>
          <span>
            <label>Pace</label>
            <input
              type="text"
              value={field.pace}
              onChange={(e) => {
                const newFields = [...fields];
                newFields[0].pace = parseInt(e.target.value);
                setFields(newFields);
              }}
            />
          </span>
        </div>
      ))}
      <button
        onClick={() =>
          setFields([...fields, { duration: 0, power: 0, pace: 0 }])
        }
      >
        Add
      </button>
    </div>
  );
}

export default App;
