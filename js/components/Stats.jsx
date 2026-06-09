// 缁熻椤甸潰缁勪欢
const Stats = ({ jars }) => {
  const chartRef = React.useRef(null);
  const chartInstance = React.useRef(null);
  const [days, setDays] = React.useState(7);

  React.useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const { dates, jarData } = getStatsData(days);

    // 鐢熸垚棰滆壊
    const colors = [
      '#22c55e', '#3b82f6', '#f59e0b', '#ef4444',
      '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
    ];

    const datasets = Object.entries(jarData).map(([name, data], index) => ({
      label: name,
      data: data.map(m => Math.round(m / 60 * 10) / 10), // 杞负灏忔椂
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
    }));

    // 鏍煎紡鍖栨棩鏈熸爣绛?    const dateLabels = dates.map(d => {
      const date = new Date(d + 'T00:00:00');
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y} 灏忔椂`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '灏忔椂',
              font: { size: 12 }
            },
            grid: { color: '#f3f4f6' },
            ticks: {
              callback: (value) => value + 'h'
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [jars, days]);

  // 璁＄畻缁熻鏁版嵁
  const today = new Date().toISOString().split('T')[0];
  const todayTotal = getTodayTotalMinutes();

  // 鏈懆鎬绘椂闂?  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split('T')[0];
  let weekTotal = 0;
  jars.forEach(jar => {
    jar.records.forEach(r => {
      if (r.date >= weekStartStr) weekTotal += r.minutes;
    });
  });

  // 鏈€闀胯繛缁ぉ鏁?  const allDates = new Set();
  jars.forEach(jar => {
    jar.records.forEach(r => allDates.add(r.date));
  });
  const sortedDates = [...allDates].sort().reverse();
  let maxStreak = 0;
  let currentStreak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, currentStreak);
  }

  return (
    <div className="page">
      <h1 className="page-title">缁熻</h1>
      <p className="page-subtitle">浜嗚В浣犵殑鏃堕棿鎶曞叆</p>

      {/* 缁熻鍗＄墖 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {todayTotal}
          </div>
          <div className="text-xs text-gray-500 mt-1">浠婃棩鍒嗛挓</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(weekTotal / 60 * 10) / 10 || '0'}
          </div>
          <div className="text-xs text-gray-500 mt-1">鏈懆灏忔椂</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {maxStreak}
          </div>
          <div className="text-xs text-gray-500 mt-1">鏈€闀胯繛缁ぉ</div>
        </div>
      </div>

      {/* 鏃堕棿鑼冨洿閫夋嫨 */}
      <div className="flex gap-2 mb-4">
        {[7, 14, 30].map(d => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              days === d ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {d}澶?          </button>
        ))}
      </div>

      {/* 鍥捐〃 */}
      <div className="glass-card p-5 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">姣忔棩鏃堕棿瓒嬪娍</h3>
        <div style={{ height: '300px' }}>
          {jars.length === 0 || jars.every(j => j.records.length === 0) ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              杩樻病鏈夎褰曟暟鎹?            </div>
          ) : (
            <canvas ref={chartRef} />
          )}
        </div>
      </div>

      {/* 缃愬瓙鎺掑悕 */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-gray-800 mb-4">缃愬瓙鎺掑悕</h3>
        {jars.length === 0 ? (
          <p className="text-gray-400 text-center py-4">杩樻病鏈夌綈瀛?/p>
        ) : (
          <div className="space-y-3">
            {[...jars]
              .map(jar => ({ ...jar, totalMinutes: getTotalMinutes(jar), progress: getProgress(jar) }))
              .sort((a, b) => b.totalMinutes - a.totalMinutes)
              .map((jar, index) => (
                <div key={jar.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-700 truncate">{jar.name}</div>
                    <div className="text-xs text-gray-400">{formatMinutes(jar.totalMinutes)}</div>
                  </div>
                  <div className="w-20">
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${jar.progress}%`,
                          background: jar.progress >= 100
                            ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                            : 'linear-gradient(90deg, #4ade80, #22c55e)'
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-10 text-right">{jar.progress}%</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
