const xmlString = `
<workout_file>
  <author/>
  <name>New-Workout-2023-12-12-14-33-32</name>
  <description/>
  <sportType>bike</sportType>
  <durationType>time</durationType>
  <tags/>
  <workout>
    <SteadyState Duration="480" Power="0.5" pace="0"/>
    <SteadyState Duration="180" Power="0.7" pace="0"/>
    <SteadyState Duration="120" Power="0.85" pace="0"/>
    <SteadyState Duration="60" Power="0.95" pace="0"/>
    <SteadyState Duration="60" Power="0.95" pace="0"/>
    <SteadyState Duration="180" Power="0.6" pace="0"/>
    <SteadyState Duration="300" Power="0.9" pace="0"/>
    <SteadyState Duration="180" Power="0.75" pace="0"/>
    <SteadyState Duration="120" Power="0.5" pace="0"/>
    <SteadyState Duration="300" Power="0.9" pace="0"/>
    <SteadyState Duration="180" Power="0.75" pace="0"/>
    <SteadyState Duration="120" Power="0.5" pace="0"/>
    <SteadyState Duration="300" Power="0.9" pace="0"/>
    <SteadyState Duration="180" Power="0.75" pace="0"/>
    <SteadyState Duration="120" Power="0.5" pace="0"/>
    <SteadyState Duration="300" Power="0.9" pace="0"/>
    <SteadyState Duration="180" Power="0.75" pace="0"/>
    <SteadyState Duration="120" Power="0.5" pace="0"/>
    <SteadyState Duration="300" Power="0.9" pace="0"/>
    <SteadyState Duration="180" Power="0.75" pace="0"/>
    <SteadyState Duration="120" Power="0.5" pace="0"/>
    <SteadyState Duration="120" Power="0.604" pace="0"/>
    <IntervalsT Repeat="3" OnDuration="30" OffDuration="120" OnPower="1.092" OffPower="0.804" pace="0"/>
    <SteadyState Duration="60" Power="0.649" pace="0"/>
    <Cooldown Duration="300" PowerLow="0.75" PowerHigh="0.25" pace="0"/>
  </workout>
  </workout_file>
`;

const todayDate = new Date().toLocaleDateString().replaceAll('/', '-');
const newName = `New-Workout-${todayDate}`;

const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
const durationElements = xmlDoc.querySelectorAll('[Duration]');
const nameElement = xmlDoc.querySelector('name');
nameElement.innerHTML = newName.toString();

durationElements.forEach((element) => {
  const currentDuration = parseInt(element.getAttribute('Duration'), 10);
  const currentPower = parseInt(element.getAttribute('Power'), 10);
  const newDuration = currentDuration * 60;
  const newPower = Math.round((currentPower / 316) * 10) / 10;
  const newPace = 80;
  element.setAttribute('Duration', newDuration.toString());
  element.setAttribute('Power', newPower.toString());
  element.setAttribute('pace', newPace.toString());
});

const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

console.log(modifiedXmlString);
