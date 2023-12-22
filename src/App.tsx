import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import "./App.css";
import { styles } from "./index.styles";

const _duration = 3;
const _power = 180;
const _pace = 80;
const _field = { duration: _duration, power: _power, pace: _pace };

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
  const [fields, setFields] = useState([_field]);
  const [xmlString, setXmlString] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newXmlString = `
      <workout_file>
        <author/>
        <name>New-Workout-${todayDate}</name>
        <description/>
        <sportType>bike</sportType>
        <durationType>time</durationType>
        <tags/>
        <workout>
        ${fields
          .map((field) => {
            const duration = field.duration * 60;
            const pace = field.pace;
            const power = Math.round((field.power / 316) * 10) / 10;
            return ` <SteadyState Duration="${duration}" Power="${power}" pace="${pace}"/>\n${space}`;
          })
          .join("")}</workout>
      </workout_file>
`;

    exportToCSV(newXmlString, `New-Workout-${todayDate}.zwo`);
    setXmlString(newXmlString);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "duration" | "pace" | "power",
    index: number
  ) => {
    setFields((prevState) => {
      const newState = [...prevState];
      newState[index][field] = parseInt(event.target.value);
      return newState;
    });
  };

  const handleAddField = () => setFields([...fields, _field]);

  return (
    <>
      <h1>Zwift ZWO Editor</h1>
      <div {...stylex.props(styles.root)}>
        <form noValidate onSubmit={handleSubmit}>
          <button
            type="button"
            role="button"
            tabIndex={0}
            {...stylex.props(styles.button)}
            onClick={handleAddField}
          >
            Add
          </button>
          {fields.map((field, index) => (
            <div {...stylex.props(styles.interval)}>
              <span {...stylex.props(styles.field)}>
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
              <span {...stylex.props(styles.field)}>
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
              <span {...stylex.props(styles.field)}>
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
          <input
            type="submit"
            value="Submit"
            {...stylex.props(styles.submit)}
          />
        </form>
        <textarea value={xmlString} rows={40} cols={70} />
      </div>
    </>
  );
};

export default App;
