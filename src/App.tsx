import { useState } from "react";
import "./App.css";

const labelStyle = { margin: "0 5px" };
const inputStyle = { width: "50px" };

const todayDate = new Date().toLocaleDateString().replaceAll("/", "-");

function App() {
  const [fields, setFields] = useState([{ duration: 0, power: 0, pace: 80 }]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newFields = [...fields].map((field) => {
      return {
        duration: field.duration * 60,
        power: Math.round((field.power / 316) * 10) / 10,
        pace: field.pace,
      };
    });
    const xmlString = `
      <workout_file>
        <author/>
        <name>New-Workout-${todayDate}</name>
        <description/>
        <sportType>bike</sportType>
        <durationType>time</durationType>
        <tags/>
        <workout>
        ${newFields.map((field) => {
          return `<SteadyState Duration="${field.duration}" Power="${field.power}" pace="${field.pace}"/> \n`;
        })}
        </workout>
        </workout_file>
`;
    console.log(xmlString);
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <h1>Zwift ZWO Editor</h1>
      {fields.map((field, index) => (
        <div style={{ margin: "5px" }}>
          <span>
            <label style={labelStyle} htmlFor={`duration-${index}`}>
              Duration (min)
            </label>
            <input
              id={`duration-${index}`}
              style={inputStyle}
              type="text"
              value={field.duration}
              onChange={(e) => {
                const newFields = [...fields];
                newFields[index].duration = parseInt(e.target.value);
                setFields(newFields);
              }}
            />
          </span>
          <span>
            <label style={labelStyle} htmlFor={`power-${index}`}>
              Power (Watts)
            </label>
            <input
              id={`power-${index}`}
              style={inputStyle}
              type="text"
              value={field.power}
              onChange={(e) => {
                const newFields = [...fields];
                newFields[index].power = parseInt(e.target.value);
                setFields(newFields);
              }}
            />
          </span>
          <span>
            <label style={labelStyle} htmlFor={`pace-${index}`}>
              Pace (RPM)
            </label>
            <input
              id={`pace-${index}`}
              style={inputStyle}
              type="text"
              value={field.pace}
              onChange={(e) => {
                const newFields = [...fields];
                newFields[index].pace = parseInt(e.target.value);
                setFields(newFields);
              }}
            />
          </span>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setFields([...fields, { duration: 0, power: 0, pace: 0 }])
        }
      >
        Add
      </button>
      <input
        type="submit"
        value="Submit"
        style={{ display: "block", width: "100%", marginTop: "10px" }}
      />
    </form>
  );
}

export default App;
