// 鐣寗閽熺粍浠?const Pomodoro = ({ jar, onComplete, onClose }) => {
  const timer = useTimer(jar.pomodoroMinutes || 25);
  const [customMinutes, setCustomMinutes] = React.useState(jar.pomodoroMinutes || 25);
  const [showCustomize, setShowCustomize] = React.useState(false);

  React.useEffect(() => {
    if (timer.isCompleted && onComplete) {
      onComplete(timer.totalSeconds / 60);
    }
  }, [timer.isCompleted]);

  const handleSetCustom = () => {
    timer.setMinutes(customMinutes);
    setShowCustomize(false);
  };

  const ringRadius = 100;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (timer.progress / 100) * ringCircumference;

  return (
    <div className="page text-center">
      {/* 杩斿洖 */}
      <div className="text-left mb-6">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
          </svg>
          杩斿洖
        </button>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-1">鐣寗閽?/h2>
      <p className="text-sm text-gray-500 mb-8">涓恒€寋jar.name}銆嶄笓娉?/p>

      {/* 璁℃椂鍣ㄥ渾鐜?*/}
      <div className="relative inline-flex items-center justify-center mb-8" style={{ width: '260px', height: '260px' }}>
        <svg width="260" height="260" viewBox="0 0 260 260" style={{ transform: 'rotate(-90deg)' }}>
          {/* 鑳屾櫙鍦嗙幆 */}
          <circle
            cx="130" cy="130" r={ringRadius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* 杩涘害鍦嗙幆 */}
          <circle
            cx="130" cy="130" r={ringRadius}
            fill="none"
            stroke={timer.isCompleted ? '#fbbf24' : '#22c55e'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringOffset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {timer.isCompleted ? (
            <div className="animate-scale-in">
              <div className="text-4xl mb-2">馃帀</div>
              <div className="text-lg font-bold text-green-600">瀹屾垚!</div>
              <div className="text-sm text-gray-500">+{Math.round(timer.totalSeconds / 60)} 鍒嗛挓</div>
            </div>
          ) : (
            <>
              <div className="text-5xl font-bold text-gray-800 tabular-nums mb-2">
                {timer.displayTime}
              </div>
              <div className="text-sm text-gray-400">
                {timer.isPaused ? '宸叉殏鍋? : timer.isRunning ? '涓撴敞涓?..' : '鍑嗗寮€濮?}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 鎺у埗鎸夐挳 */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {!timer.isRunning && !timer.isCompleted && (
          <button onClick={timer.start} className="btn btn-primary text-lg px-10 py-3 rounded-full animate-pulse-green">
            寮€濮嬩笓娉?          </button>
        )}
        {timer.isRunning && !timer.isPaused && (
          <button onClick={timer.pause} className="btn btn-secondary text-lg px-8 py-3 rounded-full">
            鏆傚仠
          </button>
        )}
        {timer.isPaused && (
          <>
            <button onClick={timer.resume} className="btn btn-primary text-lg px-8 py-3 rounded-full">
              缁х画
            </button>
            <button onClick={() => timer.reset()} className="btn btn-secondary px-6 py-3 rounded-full">
              閲嶇疆
            </button>
          </>
        )}
        {timer.isCompleted && (
          <button onClick={() => timer.reset()} className="btn btn-primary text-lg px-8 py-3 rounded-full">
            鍐嶆潵涓€娆?          </button>
        )}
      </div>

      {/* 鑷畾涔夋椂闀?*/}
      <div className="max-w-xs mx-auto">
        <button
          onClick={() => setShowCustomize(!showCustomize)}
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
          </svg>
          鑷畾涔夋椂闀?        </button>

        {showCustomize && (
          <div className="mt-3 flex items-center gap-2 animate-fade-in-up">
            <input
              type="number"
              className="input flex-1 text-center"
              value={customMinutes}
              onChange={e => setCustomMinutes(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))}
              min="1"
              max="120"
            />
            <span className="text-gray-500 text-sm">鍒嗛挓</span>
            <button onClick={handleSetCustom} className="btn btn-primary text-sm py-2">
              璁惧畾
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
