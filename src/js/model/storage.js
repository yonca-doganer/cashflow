const PREFIX = "nakit_akisi_senaryo_";

export const saveScenario = (name, config) => {
  localStorage.setItem(PREFIX + name, JSON.stringify(config));
  localStorage.setItem("nakit_akisi_last_scenario", name);
};

export const loadScenario = (name) => {
  const data = localStorage.getItem(PREFIX + name);
  return data ? JSON.parse(data) : null;
};

export const deleteScenario = (name) => {
  localStorage.removeItem(PREFIX + name);
  if (localStorage.getItem("nakit_akisi_last_scenario") === name) {
    localStorage.removeItem("nakit_akisi_last_scenario");
  }
};

export const listScenarios = () => {
  const scenarios = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(PREFIX)) {
      scenarios.push(key.replace(PREFIX, ""));
    }
  }
  return scenarios;
};

export const getLastScenario = () => {
  return localStorage.getItem("nakit_akisi_last_scenario");
};
