// 鏁版嵁瀛樺偍宸ュ叿鍑芥暟

const STORAGE_KEY = 'time-jar-data';
const SETTINGS_KEY = 'time-jar-settings';

// 鐢熸垚鍞竴 ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// 鑾峰彇鎵€鏈夌綈瀛?function getJars() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('璇诲彇鏁版嵁澶辫触:', e);
    return [];
  }
}

// 淇濆瓨鎵€鏈夌綈瀛?function saveJars(jars) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jars));
  } catch (e) {
    console.error('淇濆瓨鏁版嵁澶辫触:', e);
  }
}

// 鑾峰彇鍗曚釜缃愬瓙
function getJar(id) {
  const jars = getJars();
  return jars.find(j => j.id === id) || null;
}

// 娣诲姞缃愬瓙
function addJar(jarData) {
  const jars = getJars();
  const jar = {
    id: generateId(),
    name: jarData.name,
    description: jarData.description || '',
    goal: jarData.goal, // 10 | 100 | 1000 | 10000
    color: jarData.color || 'jar-gradient-1',
    pomodoroMinutes: jarData.pomodoroMinutes || 25,
    createdAt: new Date().toISOString(),
    records: []
  };
  jars.push(jar);
  saveJars(jars);
  return jar;
}

// 鏇存柊缃愬瓙
function updateJar(id, updates) {
  const jars = getJars();
  const index = jars.findIndex(j => j.id === id);
  if (index === -1) return null;
  jars[index] = { ...jars[index], ...updates };
  saveJars(jars);
  return jars[index];
}

// 鍒犻櫎缃愬瓙
function deleteJar(id) {
  const jars = getJars();
  const filtered = jars.filter(j => j.id !== id);
  saveJars(filtered);
}

// 娣诲姞鏃堕棿璁板綍
function addRecord(jarId, recordData) {
  const jars = getJars();
  const index = jars.findIndex(j => j.id === jarId);
  if (index === -1) return null;

  const record = {
    id: generateId(),
    minutes: recordData.minutes,
    date: recordData.date || new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    mode: recordData.mode, // 'pomodoro' | 'manual'
    note: recordData.note || ''
  };

  jars[index].records.push(record);
  saveJars(jars);
  return { jar: jars[index], record };
}

// 鍒犻櫎璁板綍
function deleteRecord(jarId, recordId) {
  const jars = getJars();
  const index = jars.findIndex(j => j.id === jarId);
  if (index === -1) return null;
  jars[index].records = jars[index].records.filter(r => r.id !== recordId);
  saveJars(jars);
  return jars[index];
}

// 璁＄畻缃愬瓙绱鏃堕棿锛堝垎閽燂級
function getTotalMinutes(jar) {
  return jar.records.reduce((sum, r) => sum + r.minutes, 0);
}

// 璁＄畻缃愬瓙杩涘害鐧惧垎姣?function getProgress(jar) {
  const totalMinutes = getTotalMinutes(jar);
  const goalMinutes = jar.goal * 60;
  return Math.min(100, Math.round((totalMinutes / goalMinutes) * 100));
}

// 鑾峰彇妞嶇墿鎴愰暱闃舵 (0-5)
function getPlantStage(jar) {
  const progress = getProgress(jar);
  if (progress >= 100) return 5; // 缁撴灉
  if (progress >= 80) return 4;  // 寮€鑺?  if (progress >= 60) return 3;  // 鎴愰暱
  if (progress >= 40) return 2;  // 骞艰嫍
  if (progress >= 20) return 1;  // 鍙戣娊
  return 0;                      // 绉嶅瓙
}

// 鑾峰彇妞嶇墿绫诲瀷
function getPlantType(goal) {
  if (goal <= 10) return 'succulent';
  if (goal <= 100) return 'sunflower';
  if (goal <= 1000) return 'tree';
  return 'ancient';
}

// 鑾峰彇妞嶇墿鍚嶇О
function getPlantName(goal) {
  const map = {
    succulent: '澶氳倝',
    sunflower: '鍚戞棩钁?,
    tree: '鐩嗘牻鏍?,
    ancient: '绁炴湪'
  };
  return map[getPlantType(goal)] || '妞嶇墿';
}

// 鏍煎紡鍖栨椂闂?function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes}鍒嗛挓`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}灏忔椂`;
  return `${hours}灏忔椂${mins}鍒嗛挓`;
}

// 鑾峰彇缃愬瓙鐩爣鏍囩
function getGoalLabel(goal) {
  const map = {
    10: '10灏忔椂',
    100: '100灏忔椂',
    1000: '1000灏忔椂',
    10000: '10000灏忔椂'
  };
  return map[goal] || `${goal}灏忔椂`;
}

// 鑾峰彇璁剧疆
function getSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { defaultPomodoroMinutes: 25 };
  } catch (e) {
    return { defaultPomodoroMinutes: 25 };
  }
}

// 淇濆瓨璁剧疆
function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// 鑾峰彇浠婃棩鎬绘椂闂?function getTodayTotalMinutes() {
  const jars = getJars();
  const today = new Date().toISOString().split('T')[0];
  let total = 0;
  jars.forEach(jar => {
    jar.records.forEach(r => {
      if (r.date === today) total += r.minutes;
    });
  });
  return total;
}

// 鑾峰彇缁熻鏁版嵁
function getStatsData(days = 7) {
  const jars = getJars();
  const dates = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  const jarData = {};
  jars.forEach(jar => {
    jarData[jar.name] = dates.map(date => {
      return jar.records
        .filter(r => r.date === date)
        .reduce((sum, r) => sum + r.minutes, 0);
    });
  });

  return { dates, jarData };
}
