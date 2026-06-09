// 创建/编辑罐子组件
const CreateJar = ({ onClose, onSave, editJar }) => {
  const [name, setName] = React.useState(editJar ? editJar.name : '');
  const [description, setDescription] = React.useState(editJar ? editJar.description : '');
  const [goal, setGoal] = React.useState(editJar ? editJar.goal : 100);
  const [color, setColor] = React.useState(editJar ? editJar.color : 'jar-gradient-4');
  const [pomodoroMinutes, setPomodoroMinutes] = React.useState(editJar ? editJar.pomodoroMinutes : 25);
  const [step, setStep] = React.useState(1);

  const goalOptions = [
    { value: 10, label: '10小时', desc: '多肉植物 · 快速达成', icon: '🌵' },
    { value: 100, label: '100小时', desc: '向日葵 · 稳步成长', icon: '🌻' },
    { value: 1000, label: '1000小时', desc: '盆栽树 · 长期坚持', icon: '🌳' },
    { value: 10000, label: '10000小时', desc: '神木 · 终身目标', icon: '🏛️' },
  ];

  const colors = [
    'jar-gradient-1', 'jar-gradient-2', 'jar-gradient-3', 'jar-gradient-4',
    'jar-gradient-5', 'jar-gradient-6', 'jar-gradient-7', 'jar-gradient-8'
  ];

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      goal,
      color,
      pomodoroMinutes
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {editJar ? '编辑罐子' : '创建新罐子'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {step === 1 && (
          <div className="animate-fade-in-up">
            <label className="block text-sm font-medium text-gray-600 mb-2">选择目标时长</label>
            <div className="space-y-3 mb-6">
              {goalOptions.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => { setGoal(opt.value); setStep(2); }}
                  className={`glass-card p-4 cursor-pointer flex items-center gap-4 transition-all ${
                    goal === opt.value ? 'ring-2 ring-green-400' : ''
                  }`}
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.desc}</div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7 10l2 2 4-4" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              返回选择目标
            </button>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">罐子名称</label>
              <input
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例如：学英语、健身、阅读..."
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">描述（可选）</label>
              <input
                className="input"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="描述一下你的目标..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">番茄钟时长（分钟）</label>
              <div className="flex gap-2">
                {[15, 25, 30, 45, 60].map(m => (
                  <button
                    key={m}
                    onClick={() => setPomodoroMinutes(m)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      pomodoroMinutes === m
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {m}min
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">罐子颜色</label>
              <div className="flex gap-2 flex-wrap">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full ${c} transition-all ${
                      color === c ? 'ring-2 ring-green-500 ring-offset-2 scale-110' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="btn btn-primary w-full"
            >
              {editJar ? '保存修改' : '创建罐子'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
