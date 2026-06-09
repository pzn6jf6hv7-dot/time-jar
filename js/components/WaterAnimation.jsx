// 娴囨按鍔ㄧ敾缁勪欢
const WaterAnimation = ({ show, onComplete }) => {
  const [drops, setDrops] = React.useState([]);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      setVisible(true);
      const newDrops = [];
      for (let i = 0; i < 8; i++) {
        newDrops.push({
          id: i,
          left: 30 + Math.random() * 40,
          delay: i * 0.12,
          duration: 0.6 + Math.random() * 0.4,
          size: 6 + Math.random() * 8
        });
      }
      setDrops(newDrops);

      const timer = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 10
    }}>
      {drops.map(drop => (
        <div
          key={drop.id}
          style={{
            position: 'absolute',
            left: `${drop.left}%`,
            top: '-10px',
            width: `${drop.size}px`,
            height: `${drop.size * 1.4}px`,
            background: 'linear-gradient(180deg, #60a5fa, #3b82f6)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            opacity: 0,
            animation: `waterDrop ${drop.duration}s ease-in ${drop.delay}s forwards`
          }}
        />
      ))}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        fontSize: '20px',
        fontWeight: 600,
        color: '#16a34a',
        textShadow: '0 1px 4px rgba(0,0,0,0.1)',
        animation: 'fadeInUp 0.5s ease-out 0.8s both'
      }}>
        + 娴囨按鎴愬姛!
      </div>
    </div>
  );
};
