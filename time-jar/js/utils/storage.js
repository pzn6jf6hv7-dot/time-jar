// 数据存储工具函数

const STORAGE_KEY = 'time-jar-data';
const SETTINGS_KEY = 'time-jar-settings';

// 生成唯一 ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// 获取所有罐子
function getJars() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('读取数据失败:', e);
    return [];
  }
}

// 保存所有罐子
function saveJars(jars) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jars));
  } catch (e) {
    console.error('保存数据失败:', e);
  }
}

// 获取单个罐子
function getJar(id) {
  const jars = getJars();
  return jars.find(j => j.id === id) || null;
}

// 添加罐子
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

// 更新罐子
function updateJar(id, updates) {
  const jars = getJars();
  const index = jars.findIndex(j => j.id === id);
  if (index === -1) return null;
  jars[index] = { ...jars[index], ...updates };
  saveJars(jars);
  return jars[index];
}

// 删除罐子
function deleteJar(id) {
  const jars = getJars();
  const filtered = jars.filter(j => j.id !== id);
  saveJars(filtered);
}

// 添加时间记录
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

// 删除记录
function deleteRecord(jarId, recordId) {
  const jars = getJars();
  const index = jars.findIndex(j => j.id === jarId);
  if (index === -1) return null;
  jars[index].records = jars[index].records.filter(r => r.id !== recordId);
  saveJars(jars);
  return jars[index];
}

// 计算罐子累计时间（分钟）
function getTotalMinutes(jar) {
  return jar.records.reduce((sum, r) => sum + r.minutes, 0);
}

// 计算罐子进度百分比
function getProgress(jar) {
  const totalMinutes = getTotalMinutes(jar);
  const goalMinutes = jar.goal * 60;
  return Math.min(100, Math.round((totalMinutes / goalMinutes) * 100));
}

// 获取植物成长阶段 (0-5)
function getPlantStage(jar) {
  const progress = getProgress(jar);
  if (progress >= 100) return 5; // 结果
  if (progress >= 80) return 4;  // 开花
  if (progress >= 60) return 3;  // 成长
  if (progress >= 40) return 2;  // 幼苗
  if (progress >= 20) return 1;  // 发芽
  return 0;                      // 种子
}

// 获取植物类型
function getPlantType(goal) {
  if (goal <= 10) return 'succulent';
  if (goal <= 100) return 'sunflower';
  if (goal <= 1000) return 'tree';
  return 'ancient';
}

// 获取植物名称
function getPlantName(goal) {
  const map = {
    succulent: '多肉',
    sunflower: '向日葵',
    tree: '盆栽树',
    ancient: '神木'
  };
  return map[getPlantType(goal)] || '植物';
}

// 格式化时间
function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}小时`;
  return `${hours}小时${mins}分钟`;
}

// 获取罐子目标标签
function getGoalLabel(goal) {
  const map = {
    10: '10小时',
    100: '100小时',
    1000: '1000小时',
    10000: '10000小时'
  };
  return map[goal] || `${goal}小时`;
}

// 获取设置
function getSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { defaultPomodoroMinutes: 25 };
  } catch (e) {
    return { defaultPomodoroMinutes: 25 };
  }
}

// 保存设置
function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// 获取今日总时间
function getTodayTotalMinutes() {
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

// 获取统计数据
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
