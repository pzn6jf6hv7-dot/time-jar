// 主应用入口
const App = () => {
  const { jars, loading, add, update, remove, addTime, removeRecord, refresh } = useJars();
  const [currentPage, setCurrentPage] = React.useState('garden');
  const [selectedJarId, setSelectedJarId] = React.useState(null);

  const selectedJar = React.useMemo(() => {
    if (!selectedJarId) return null;
    return jars.find(j => j.id === selectedJarId) || null;
  }, [jars, selectedJarId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🪴</div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'garden':
        return (
          <Garden
            jars={jars}
            onAddJar={add}
            onEditJar={update}
            onDeleteJar={remove}
            onOpenJar={(id) => {
              setSelectedJarId(id);
              setCurrentPage('detail');
            }}
            onCreateJar={() => {}}
            onNavigate={() => {}}
          />
        );

      case 'detail':
        if (!selectedJar) {
          setCurrentPage('garden');
          return null;
        }
        return (
          <JarDetail
            key={selectedJar.id}
            jar={selectedJar}
            onBack={() => {
              setSelectedJarId(null);
              setCurrentPage('garden');
            }}
            onAddTime={addTime}
            onDeleteRecord={removeRecord}
            onRefresh={refresh}
          />
        );

      case 'stats':
        return <Stats jars={jars} />;

      default:
        return null;
    }
  };

  return (
    <div>
      {renderPage()}

      {/* 底部导航 */}
      <nav className="nav-bar">
        <button
          className={`nav-item ${currentPage === 'garden' ? 'active' : ''}`}
          onClick={() => { setSelectedJarId(null); setCurrentPage('garden'); }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
          </svg>
          <span>花园</span>
        </button>

        <button
          className={`nav-item ${currentPage === 'stats' ? 'active' : ''}`}
          onClick={() => { setSelectedJarId(null); setCurrentPage('stats'); }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
          </svg>
          <span>统计</span>
        </button>

        {selectedJarId && (
          <button
            className={`nav-item ${currentPage === 'detail' ? 'active' : ''}`}
            onClick={() => setCurrentPage('detail')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <span>详情</span>
          </button>
        )}
      </nav>
    </div>
  );
};

// 渲染
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
