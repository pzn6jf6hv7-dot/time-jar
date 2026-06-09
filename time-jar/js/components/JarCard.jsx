// 罐子卡片组件
const JarCard = ({ jar, onClick, onDelete }) => {
  const totalMinutes = getTotalMinutes(jar);
  const progress = getProgress(jar);
  const stage = getPlantStage(jar);
  const plantType = getPlantType(jar.goal);
  const plantName = getPlantName(jar.goal);
  const goalLabel = getGoalLabel(jar.goal);

  return (
    <div
      className="glass-card p-5 cursor-pointer animate-scale-in relative group"
      onClick={onClick}
    >
      {/* 删除按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`确定删除罐子「${jar.name}」吗？所有记录将丢失。`)) {
            onDelete(jar.id);
          }
        }}
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
        title="删除罐子"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
        </svg>
      </button>

      {/* 植物 */}
      <div className="flex justify-center mb-3" style={{ height: '120px' }}>
        <PlantCanvas plantType={plantType} stage={stage} size={120} color={jar.color} />
      </div>

      {/* 信息 */}
      <div className="text-center">
        <h3 className="font-semibold text-gray-800 text-lg mb-1">{jar.name}</h3>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
          <span>{getStageEmoji(stage)} {getStageLabel(stage)}</span>
          <span>·</span>
          <span>{plantName}</span>
          <span>·</span>
          <span>{goalLabel}</span>
        </div>

        {/* 进度条 */}
        <div className="progress-bar mb-2">
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

        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatMinutes(totalMinutes)}</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
