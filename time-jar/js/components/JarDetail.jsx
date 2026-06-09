// 罐子详情页组件
const JarDetail = ({ jar, onBack, onAddTime, onDeleteRecord, onRefresh }) => {
  const [showPomodoro, setShowPomodoro] = React.useState(false);
  const [manualHours, setManualHours] = React.useState('');
  const [manualMinutes, setManualMinutes] = React.useState('');
  const [manualNote, setManualNote] = React.useState('');
  const [showWaterAnim, setShowWaterAnim] = React.useState(false);
  const [mode, setMode] = React.useState('manual'); // 'manual' | 'pomodoro'

  const totalMinutes = getTotalMinutes(jar);
  const progress = getProgress(jar);
  const stage = getPlantStage(jar);
  const plantType = getPlantType(jar.goal);
  const goalLabel = getGoalLabel(jar.goal);
  const plantName = getPlantName(jar.goal);

  const goalMinutes = jar.goal * 60;
  const remainingMinutes = Math.max(0, goalMinutes - totalMinutes);

  // 按日期分组记录
  const groupedRecords = React.useMemo(() => {
    const groups = {};
    [...jar.records].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(r => {
      if (!groups[r.date]) groups[r.date] = [];
      groups[r.date].push(r);
    });
    return groups;
  }, [jar.records]);

  const handleManualAdd = () => {
    const hours = parseInt(manualHours) || 0;
    const mins = parseInt(manualMinutes) || 0;
    const totalMins = hours * 60 + mins;
    if (totalMins <= 0) return;

    onAddTime(jar.id, {
      minutes: totalMins,
      mode: 'manual',
      note: manualNote.trim()
    });

    setShowWaterAnim(true);
    setManualHours('');
    setManualMinutes('');
    setManualNote('');
  };

  const handlePomodoroComplete = (minutes) => {
    onAddTime(jar.id, {
      minutes: Math.round(minutes),
      mode: 'pomodoro',
      note: `番茄钟 ${Math.round(minutes)}分钟`
    });
    setShowPomodoro(false);
    setShowWaterAnim(true);
  };

  if (showPomodoro) {
    return (
      <Pomodoro
        jar={jar}
        onComplete={handlePomodoroComplete}
        onClose={() => setShowPomodoro(false)}
      />
    );
  }

  return (
    <div className="page relative">
      {/* 返回 */}
      <div className="mb-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
          </svg>
          返回花园
        </button>
      </div>

      {/* 植物大图 */}
      <div className="glass-card p-6 mb-6 text-center relative">
        <WaterAnimation show={showWaterAnim} onComplete={() => setShowWaterAnim(false)} />

        <div className="flex justify-center mb-2" style={{ height: '220px' }}>
          <PlantCanvas plantType={plantType} stage={stage} size={220} color={jar.color} wiggle={showWaterAnim} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">{jar.name}</h1>
        {jar.description && (
          <p className="text-sm text-gray-500 mb-2">{jar.description}</p>
        )}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
          <span>{getStageEmoji(stage)} {getStageLabel(stage)}</span>
          <span>·</span>
          <span>{plantName}</span>
          <span>·</span>
          <span>{goalLabel}</span>
        </div>

        {/* 进度条 */}
        <div className="progress-bar mb-2 max-w-xs mx-auto">
          <div
            className="progress-bar-fill"
            style={{
              width: `${progress}%`,
              background: progress >= 100
                ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                : 'linear-gradient(90deg, #4ade80, #22c55e)'
            }}
          />
        </div>
        <div className="flex justify-between max-w-xs mx-auto text-sm text-gray-500">
          <span>{formatMinutes(totalMinutes)} / {goalLabel}</span>
          <span>{progress}%</span>
        </div>
        {progress < 100 && (
          <p className="text-xs text-gray-400 mt-2">
            还需 {formatMinutes(remainingMinutes)}
          </p>
        )}
        {progress >= 100 && (
          <p className="text-sm text-yellow-600 font-medium mt-2">
            🎉 目标达成！太棒了！
          </p>
        )}
      </div>

      {/* 记录时间 */}
      <div className="glass-card p-5 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">记录时间</h3>

        {/* 模式切换 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === 'manual' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            手动记录
          </button>
          <button
            onClick={() => setMode('pomodoro')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === 'pomodoro' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            番茄钟
          </button>
        </div>

        {mode === 'manual' && (
          <div className="animate-fade-in-up">
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">小时</label>
                <input
                  type="number"
                  className="input text-center"
                  value={manualHours}
                  onChange={e => setManualHours(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">分钟</label>
                <input
                  type="number"
                  className="input text-center"
                  value={manualMinutes}
                  onChange={e => setManualMinutes(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="59"
                />
              </div>
            </div>
            <input
              className="input mb-3"
              value={manualNote}
              onChange={e => setManualNote(e.target.value)}
              placeholder="备注（可选）"
            />
            <button onClick={handleManualAdd} className="btn btn-primary w-full">
              浇水记录
            </button>
          </div>
        )}

        {mode === 'pomodoro' && (
          <div className="animate-fade-in-up text-center py-4">
            <p className="text-gray-500 mb-4">
              开始 {jar.pomodoroMinutes || 25} 分钟的专注时间
            </p>
            <button
              onClick={() => setShowPomodoro(true)}
              className="btn btn-primary px-8 py-3 rounded-full text-lg"
            >
              开始番茄钟
            </button>
          </div>
        )}
      </div>

      {/* 历史记录 */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-gray-800 mb-4">
          历史记录
          <span className="text-sm text-gray-400 font-normal ml-2">
            ({jar.records.length} 条)
          </span>
        </h3>

        {jar.records.length === 0 ? (
          <p className="text-center text-gray-400 py-6">还没有记录，开始浇水吧！</p>
        ) : (
          <div className="space-y-1">
            {Object.entries(groupedRecords).map(([date, records]) => (
              <div key={date}>
                <div className="text-xs text-gray-400 font-medium px-2 py-2 sticky top-0 bg-white/80 backdrop-blur">
                  {date}
                </div>
                {records.map(record => (
                  <div key={record.id} className="record-item group">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      record.mode === 'pomodoro' ? 'bg-red-400' : 'bg-blue-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700">
                        +{formatMinutes(record.minutes)}
                        <span className="text-xs text-gray-400 ml-2">
                          {record.mode === 'pomodoro' ? '番茄钟' : '手动'}
                        </span>
                      </div>
                      {record.note && (
                        <div className="text-xs text-gray-400 truncate">{record.note}</div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('确定删除这条记录吗？')) {
                          onDeleteRecord(jar.id, record.id);
                        }
                      }}
                      className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
