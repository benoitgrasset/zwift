const xmlString = `
<workout_file>
  <author/>
  <name>New-Workout-2023-12-12-14-33-32</name>
  <description/>
  <sportType>bike</sportType>
  <durationType>time</durationType>
  <tags/>
  <workout>
  <SteadyState Duration="8" Power="156" pace="0" />
  <SteadyState Duration="3" Power="220" pace="0" />
  <SteadyState Duration="2" Power="270" pace="0" />
  <SteadyState Duration="1" Power="300" pace="0" />
  <SteadyState Duration="1" Power="350" pace="0" />
  <SteadyState Duration="3.5" Power="190" pace="0" />
  <SteadyState Duration="4.5" Power="230" pace="0" />
  <SteadyState Duration="2" Power="175" pace="0" />
  <SteadyState Duration="2" Power="280" pace="0" />
  <SteadyState Duration="6" Power="260" pace="0" />
  <SteadyState Duration="2" Power="175" pace="0" />
  <SteadyState Duration="2" Power="280" pace="0" />
  <SteadyState Duration="6" Power="260" pace="0" />
  <SteadyState Duration="2" Power="175" pace="0" />
  <SteadyState Duration="2" Power="280" pace="0" />
  <SteadyState Duration="6" Power="260" pace="0" />
  <SteadyState Duration="2" Power="175" pace="0" />
  <SteadyState Duration="2" Power="280" pace="0" />
  <SteadyState Duration="6" Power="260" pace="0" />
  <SteadyState Duration="2" Power="175" pace="0" />
  <SteadyState Duration="1" Power="330" pace="0" />
  <SteadyState Duration="3" Power="220" pace="0" />
  <SteadyState Duration="1" Power="330" pace="0" />
  <SteadyState Duration="3" Power="220" pace="0" />
  <SteadyState Duration="1" Power="330" pace="0" />
  <SteadyState Duration="3" Power="220" pace="0" />
  <SteadyState Duration="1" Power="330" pace="0" />
  <SteadyState Duration="3" Power="220" pace="0" />
  <SteadyState Duration="1" Power="330" pace="0" />
  <SteadyState Duration="3" Power="220" pace="0" />
  </workout>
  </workout_file>
`;

const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
const durationElements = xmlDoc.querySelectorAll('[Duration]');

durationElements.forEach((element) => {
  const currentDuration = parseInt(element.getAttribute('Duration'), 10);
  const currentPower = parseInt(element.getAttribute('Power'), 10);
  const newDuration = currentDuration * 60;
  const newPower = Math.round((currentPower / 316) * 10) / 10;
  const newPace = 0;
  element.setAttribute('Duration', newDuration.toString());
  element.setAttribute('Power', newPower.toString());
  element.setAttribute('pace', newPace.toString());
});

const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

console.log(modifiedXmlString);
