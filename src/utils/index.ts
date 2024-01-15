import vkbeautify from "vkbeautify";
import { FinalField, Ramp } from "../App";

export const downLoadFile = (data: string, fileName: string) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.style.display = "none";
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
};

const todayDate = new Date().toLocaleDateString().replaceAll("/", "-");

export const createXMLString = (
  fields: FinalField[],
  warmup?: Ramp,
  cooldown?: Ramp
) => {
  const xmlDoc = document.implementation.createDocument(
    null,
    "workout_file",
    null
  );
  const workoutFile = xmlDoc.documentElement;

  const authorElement = xmlDoc.createElement("author");
  const nameElement = xmlDoc.createElement("name");
  const descriptionElement = xmlDoc.createElement("description");
  const sportTypeElement = xmlDoc.createElement("sportType");
  const durationTypeElement = xmlDoc.createElement("durationType");
  const tagsElement = xmlDoc.createElement("tags");
  const workoutElement = xmlDoc.createElement("workout");

  nameElement.textContent = `New-Workout-${todayDate}`;
  sportTypeElement.textContent = "bike";
  durationTypeElement.textContent = "time";

  if (warmup) {
    const warmupElement = xmlDoc.createElement("Warmup");
    warmupElement.setAttribute("Duration", `${warmup.duration}`);
    warmupElement.setAttribute("PowerLow", `${warmup.PowerLow}`);
    warmupElement.setAttribute("PowerHigh", `${warmup.PowerHigh}`);
    warmupElement.setAttribute("pace", `${warmup.pace}`);
    workoutElement.appendChild(warmupElement);
  }

  fields.forEach(({ duration, power, pace }) => {
    const steadyStateElement = xmlDoc.createElement("SteadyState");
    steadyStateElement.setAttribute("Duration", `${duration}`);
    steadyStateElement.setAttribute("Power", `${power}`);
    steadyStateElement.setAttribute("pace", `${pace}`);
    workoutElement.appendChild(steadyStateElement);
  });

  if (cooldown) {
    const cooldownElement = xmlDoc.createElement("Cooldown");
    cooldownElement.setAttribute("Duration", `${cooldown.duration}`);
    cooldownElement.setAttribute("PowerLow", `${cooldown.PowerLow}`);
    cooldownElement.setAttribute("PowerHigh", `${cooldown.PowerHigh}`);
    cooldownElement.setAttribute("pace", `${cooldown.pace}`);
    workoutElement.appendChild(cooldownElement);
  }

  workoutFile.appendChild(authorElement);
  workoutFile.appendChild(nameElement);
  workoutFile.appendChild(descriptionElement);
  workoutFile.appendChild(sportTypeElement);
  workoutFile.appendChild(durationTypeElement);
  workoutFile.appendChild(tagsElement);
  workoutFile.appendChild(workoutElement);

  const xmlString = new XMLSerializer().serializeToString(xmlDoc);
  const prettyXmlString = vkbeautify.xml(xmlString);

  return prettyXmlString;
};

export const parseXMLFile = (xmlString: string) => {
  const parser = new DOMParser();

  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const intervalsElement = xmlDoc.getElementsByTagName("SteadyState");
  const warmupElement = xmlDoc.getElementsByTagName("Warmup");
  const cooldownElement = xmlDoc.getElementsByTagName("Cooldown");

  const intervals = Array.from(intervalsElement).map((interval) => {
    const duration = interval.getAttribute("Duration") || "3";
    const power = Number(interval.getAttribute("Power") || "180");
    const pace = Number(interval.getAttribute("pace") || "80");
    return { duration, power, pace, selected: false };
  });
  const warmup = Array.from(warmupElement).map((interval) => {
    const duration = interval.getAttribute("Duration") || "3";
    const PowerLow = Number(interval.getAttribute("PowerLow") || "80");
    const PowerHigh = Number(interval.getAttribute("PowerHigh") || "237");
    const pace = Number(interval.getAttribute("pace") || "80");
    return { duration, PowerLow, PowerHigh, pace, selected: false };
  })[0];
  const cooldown = Array.from(cooldownElement).map((interval) => {
    const duration = interval.getAttribute("Duration") || "3";
    const PowerLow = Number(interval.getAttribute("PowerLow") || "80");
    const PowerHigh = Number(interval.getAttribute("PowerHigh") || "237");
    const pace = Number(interval.getAttribute("pace") || "80");
    return { duration, PowerLow, PowerHigh, pace, selected: false };
  })[0];
  if (!intervals) return null;
  return { intervals, warmup, cooldown };
};
