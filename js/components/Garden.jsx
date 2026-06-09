// 鑺卞洯棣栭〉缁勪欢
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
      {/* 澶撮儴 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">鎴戠殑鑺卞洯</h1>
          <p className="page-subtitle mb-0">
            浠婃棩宸叉姇鍏?{formatMinutes(todayMinutes)}
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

      {/* 绌虹姸鎬?*/}
      {jars.length === 0 && (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="text-6xl mb-4">馃</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">杩樻病鏈夌綈瀛?/h3>
          <p className="text-gray-500 mb-6">鍒涘缓浣犵殑绗竴涓椂闂寸綈瀛愶紝寮€濮嬪煿鍏讳範鎯惂锛?/p>
          <button
            onClick={() => { setEditJarData(null); setShowCreate(true); }}
            className="btn btn-primary"
          >
            鍒涘缓缃愬瓙
          </button>
        </div>
      )}

      {/* 缃愬瓙缃戞牸 */}
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

      {/* 鍒涘缓/缂栬緫寮圭獥 */}
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
