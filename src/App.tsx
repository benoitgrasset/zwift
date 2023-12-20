import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import "./App.css";
import { styles } from "./index.styles";

const _duration = 3;
const _power = 180;
const _pace = 80;

const space = "        ";

const todayDate = new Date().toLocaleDateString().replaceAll("/", "-");

const exportToCSV = (data: string, fileName: string) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.style.display = "none";
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
};

const App = () => {
  const [fields, setFields] = useState([
    { duration: _duration, power: _power, pace: _pace },
  ]);

  const [xmlString, setXmlString] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newFields = [...fields].map((field) => {
      return {
        duration: field.duration * 60,
        power: Math.round((field.power / 316) * 10) / 10,
        pace: field.pace,
      };
    });
    const newXmlString = `
      <workout_file>
        <author/>
        <name>New-Workout-${todayDate}</name>
        <description/>
        <sportType>bike</sportType>
        <durationType>time</durationType>
        <tags/>
        <workout>
        ${newFields
          .map(
            (field) =>
              ` <SteadyState Duration="${field.duration}" Power="${field.power}" pace="${field.pace}"/>\n${space}`
          )
          .join("")}</workout>
      </workout_file>
`;

    exportToCSV(newXmlString, `New-Workout-${todayDate}.zwo`);
    setXmlString(newXmlString);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "duration" | "pace" | "power",
    index: number
  ) => {
    const newFields = [...fields];
    newFields[index][field] = parseInt(e.target.value);
    setFields(newFields);
  };

  return (
    <>
      <h1>Zwift ZWO Editor</h1>
      <div {...stylex.props(styles.root)}>
        <form noValidate onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div style={{ margin: "5px" }}>
              <span>
                <label
                  {...stylex.props(styles.label)}
                  htmlFor={`duration-${index}`}
                >
                  Duration (min)
                </label>
                <input
                  id={`duration-${index}`}
                  {...stylex.props(styles.input)}
                  type="text"
                  value={field.duration}
                  onChange={(e) => handleChange(e, "duration", index)}
                />
              </span>
              <span>
                <label
                  {...stylex.props(styles.label)}
                  htmlFor={`power-${index}`}
                >
                  Power (Watts)
                </label>
                <input
                  id={`power-${index}`}
                  {...stylex.props(styles.input)}
                  type="text"
                  value={field.power}
                  onChange={(e) => handleChange(e, "pace", index)}
                />
              </span>
              <span>
                <label
                  {...stylex.props(styles.label)}
                  htmlFor={`pace-${index}`}
                >
                  Pace (RPM)
                </label>
                <input
                  id={`pace-${index}`}
                  {...stylex.props(styles.input)}
                  type="text"
                  value={field.pace}
                  onChange={(e) => handleChange(e, "pace", index)}
                />
              </span>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFields([
                ...fields,
                { duration: _duration, power: _power, pace: _pace },
              ])
            }
          >
            Add
          </button>
          <input
            type="submit"
            value="Submit"
            {...stylex.props(styles.button)}
          />
        </form>
        <textarea value={xmlString} rows={40} cols={70} />
      </div>
    </>
  );
};

export default App;
