// 花园首页组件
const Garden = ({ jars, onAddJar, onEditJar, onDeleteJar, onOpenJar, onCreateJar, onNavigate }) => {
  const [showCreate, setShowCreate] = React.useState(false);
  const [editJarData, setEditJarData] = React.useState(null);
  const todayMinutes = getTodayTotalMinutes();

  const handleSave = (jarData) => {
    if (editJarData) {
      onEditJar(editJarData.id, jarData);
      setEditJarData(null);
    } else {
      onAddJar(jarData);
    }
    setShowCreate(false);
  };

  return (
    <div className="page">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">我的花园</h1>
          <p className="page-subtitle mb-0">
            今日已投入 {formatMinutes(todayMinutes)}
          </p>
        </div>
        <button
          onClick={() => { setEditJarData(null); setShowCreate(true); }}
          className="btn btn-primary rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-lg"
        >
          <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
          </svg>
        </button>
      </div>

      {/* 空状态 */}
      {jars.length === 0 && (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="text-6xl mb-4">🪴</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">还没有罐子</h3>
          <p className="text-gray-500 mb-6">创建你的第一个时间罐子，开始培养习惯吧！</p>
          <button
            onClick={() => { setEditJarData(null); setShowCreate(true); }}
            className="btn btn-primary"
          >
            创建罐子
          </button>
        </div>
      )}

      {/* 罐子网格 */}
      <div className="grid grid-cols-2 gap-4">
        {jars.map(jar => (
          <JarCard
            key={jar.id}
            jar={jar}
            onClick={() => onOpenJar(jar.id)}
            onDelete={onDeleteJar}
          />
        ))}
      </div>

      {/* 创建/编辑弹窗 */}
      {showCreate && (
        <CreateJar
          onClose={() => { setShowCreate(false); setEditJarData(null); }}
          onSave={handleSave}
          editJar={editJarData}
        />
      )}
    </div>
  );
};
