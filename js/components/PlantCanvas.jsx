// 妞嶇墿 Canvas 缁勪欢
const PlantCanvas = ({ plantType, stage, size = 200, color, wiggle = false }) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);
    drawPlant(ctx, size, size, plantType, stage, color);
  }, [plantType, stage, size, color]);

  return (
    <canvas
      ref={canvasRef}
      className={wiggle ? 'animate-plant-wiggle' : ''}
      style={{ display: 'block', margin: '0 auto' }}
    />
  );
};
