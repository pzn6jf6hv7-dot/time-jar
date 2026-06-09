// 植物绘制逻辑 - Canvas API

// 植物绘制主函数
function drawPlant(ctx, width, height, plantType, stage, color) {
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height * 0.7;

  switch (plantType) {
    case 'succulent':
      drawSucculent(ctx, cx, cy, stage, color);
      break;
    case 'sunflower':
      drawSunflower(ctx, cx, cy, stage, color);
      break;
    case 'tree':
      drawTree(ctx, cx, cy, stage, color);
      break;
    case 'ancient':
      drawAncient(ctx, cx, cy, stage, color);
      break;
    default:
      drawSucculent(ctx, cx, cy, stage, color);
  }

  // 花盆
  drawPot(ctx, cx, cy, stage);
}

// 花盆
function drawPot(ctx, cx, cy, stage) {
  const potWidth = 36;
  const potHeight = 32;
  const potTop = cy + 10;

  // 花盆主体
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.moveTo(cx - potWidth / 2, potTop);
  ctx.lineTo(cx - potWidth / 2 + 6, potTop + potHeight);
  ctx.lineTo(cx + potWidth / 2 - 6, potTop + potHeight);
  ctx.lineTo(cx + potWidth / 2, potTop);
  ctx.closePath();
  ctx.fill();

  // 花盆高光
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(cx - potWidth / 2 + 4, potTop + 2);
  ctx.lineTo(cx - potWidth / 2 + 8, potTop + potHeight - 4);
  ctx.lineTo(cx, potTop + potHeight - 4);
  ctx.lineTo(cx - 2, potTop + 2);
  ctx.closePath();
  ctx.fill();

  // 花盆顶部边框
  ctx.fillStyle = '#b45309';
  ctx.fillRect(cx - potWidth / 2 - 2, potTop - 3, potWidth + 4, 6);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(cx - potWidth / 2, potTop - 2, potWidth, 4);

  // 泥土
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.ellipse(cx, potTop + 3, potWidth / 2 - 2, 6, 0, 0, Math.PI * 2);
  ctx.fill();
}

// 多肉植物 - 6阶段
function drawSucculent(ctx, cx, cy, stage, color) {
  const baseY = cy;
  const sizes = [8, 14, 20, 28, 36, 44];
  const petalCount = [2, 4, 6, 8, 10, 12];
  const size = sizes[stage];
  const count = petalCount[stage];

  // 中心
  if (stage >= 1) {
    ctx.fillStyle = '#a3e635';
    ctx.beginPath();
    ctx.arc(cx, baseY - size * 0.3, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  // 花瓣
  const colors = ['#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const petalSize = size * (0.5 + (stage * 0.08));
    const dist = size * 0.35;
    const px = cx + Math.cos(angle) * dist;
    const py = baseY - size * 0.2 + Math.sin(angle) * dist * 0.6;

    ctx.fillStyle = colors[Math.min(stage, colors.length - 1)];
    ctx.beginPath();
    ctx.ellipse(px, py, petalSize * 0.35, petalSize * 0.55, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  // 开花/结果阶段的小花
  if (stage >= 4) {
    const flowerSize = size * 0.2;
    ctx.fillStyle = stage === 5 ? '#fbbf24' : '#f472b6';
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
      const fx = cx + Math.cos(angle) * size * 0.5;
      const fy = baseY - size * 0.4 + Math.sin(angle) * size * 0.5;
      ctx.beginPath();
      for (let j = 0; j < 5; j++) {
        const a = (j / 5) * Math.PI * 2;
        const r = flowerSize;
        ctx.lineTo(fx + Math.cos(a) * r, fy + Math.sin(a) * r * 0.6);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
}

// 向日葵 - 6阶段
function drawSunflower(ctx, cx, cy, stage, color) {
  const baseY = cy;
  const heights = [10, 30, 60, 90, 120, 140];
  const height = heights[stage];

  // 茎
  if (stage >= 1) {
    const stemHeight = height * 0.65;
    ctx.strokeStyle = '#65a30d';
    ctx.lineWidth = stage >= 4 ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(cx, baseY);
    ctx.lineTo(cx, baseY - stemHeight);
    ctx.stroke();

    // 叶子
    if (stage >= 2) {
      const leafCount = stage >= 4 ? 4 : 2;
      for (let i = 0; i < leafCount; i++) {
        const leafY = baseY - stemHeight * (0.3 + i * 0.25);
        const side = i % 2 === 0 ? 1 : -1;
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.ellipse(cx + side * 12, leafY, 14, 6, side * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // 花盘
  if (stage >= 1) {
    const headY = baseY - height * 0.65;
    const headSize = 10 + stage * 4;

    // 花瓣
    const petalCount = stage >= 4 ? 14 : stage >= 2 ? 10 : 6;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      ctx.fillStyle = stage >= 4 ? '#fbbf24' : '#fde68a';
      ctx.beginPath();
      ctx.ellipse(
        cx + Math.cos(angle) * headSize * 0.7,
        headY + Math.sin(angle) * headSize * 0.7,
        headSize * 0.3,
        headSize * 0.6,
        angle,
        0, Math.PI * 2
      );
      ctx.fill();
    }

    // 花心
    ctx.fillStyle = stage >= 4 ? '#92400e' : '#78350f';
    ctx.beginPath();
    ctx.arc(cx, headY, headSize * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // 种子纹理
    if (stage >= 3) {
      ctx.fillStyle = '#451a03';
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        for (let r = 1; r <= 2; r++) {
          ctx.beginPath();
          ctx.arc(
            cx + Math.cos(angle) * r * 3,
            headY + Math.sin(angle) * r * 3,
            1.5,
            0, Math.PI * 2
          );
          ctx.fill();
        }
      }
    }
  }

  // 种子阶段
  if (stage === 0) {
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(cx, baseY - 6, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 盆栽树 - 6阶段
function drawTree(ctx, cx, cy, stage, color) {
  const baseY = cy;
  const heights = [8, 30, 55, 80, 100, 120];
  const height = heights[stage];

  // 树干
  if (stage >= 1) {
    const trunkHeight = height * 0.5;
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    const tw = 4 + stage;
    ctx.moveTo(cx - tw / 2, baseY);
    ctx.lineTo(cx - tw / 2 + 1, baseY - trunkHeight);
    ctx.lineTo(cx + tw / 2 - 1, baseY - trunkHeight);
    ctx.lineTo(cx + tw / 2, baseY);
    ctx.closePath();
    ctx.fill();

    // 树干纹理
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    for (let i = 1; i < stage; i++) {
      const ly = baseY - trunkHeight * (i / stage);
      ctx.beginPath();
      ctx.moveTo(cx - tw / 2 + 1, ly);
      ctx.lineTo(cx + tw / 2 - 1, ly);
      ctx.stroke();
    }
  }

  // 树冠 - 多层圆
  if (stage >= 1) {
    const crownBase = baseY - height * 0.5;
    const crownSize = 10 + stage * 6;
    const layers = stage;

    const greenShades = ['#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'];

    for (let layer = layers; layer >= 1; layer--) {
      const ly = crownBase - (layers - layer) * crownSize * 0.2;
      const lsize = crownSize * (0.6 + layer * 0.15);

      ctx.fillStyle = greenShades[Math.min(layer, greenShades.length - 1)];
      ctx.beginPath();
      ctx.arc(cx, ly, lsize * 0.5, Math.PI, 0);
      ctx.fill();
    }

    // 果实
    if (stage >= 5) {
      const fruitColors = ['#ef4444', '#f97316', '#eab308'];
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const dist = crownSize * 0.45;
        ctx.fillStyle = fruitColors[i % 3];
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(angle) * dist,
          crownBase - crownSize * 0.3 + Math.sin(angle) * dist * 0.7,
          4,
          0, Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  // 种子
  if (stage === 0) {
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(cx, baseY - 5, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 神木 - 6阶段
function drawAncient(ctx, cx, cy, stage, color) {
  const baseY = cy;
  const heights = [10, 35, 65, 95, 130, 160];
  const height = heights[stage];

  // 树干 - 粗壮
  if (stage >= 1) {
    const trunkHeight = height * 0.55;
    const tw = 5 + stage * 2;

    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(cx - tw / 2, baseY);
    ctx.quadraticCurveTo(cx - tw / 2 - 1, baseY - trunkHeight / 2, cx - tw / 2 + 2, baseY - trunkHeight);
    ctx.lineTo(cx + tw / 2 - 2, baseY - trunkHeight);
    ctx.quadraticCurveTo(cx + tw / 2 + 1, baseY - trunkHeight / 2, cx + tw / 2, baseY);
    ctx.closePath();
    ctx.fill();

    // 树皮纹理
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1;
    for (let i = 1; i < stage + 1; i++) {
      const ly = baseY - trunkHeight * (i / (stage + 2));
      ctx.beginPath();
      ctx.moveTo(cx - tw / 2 + 1, ly);
      ctx.quadraticCurveTo(cx, ly + (i % 2 === 0 ? 2 : -2), cx + tw / 2 - 1, ly);
      ctx.stroke();
    }

    // 树枝
    if (stage >= 2) {
      const branchCount = stage >= 4 ? 4 : 2;
      for (let i = 0; i < branchCount; i++) {
        const by = baseY - trunkHeight * (0.6 + i * 0.15);
        const side = i % 2 === 0 ? 1 : -1;
        const branchLen = 8 + stage * 3;

        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, by);
        ctx.quadraticCurveTo(
          cx + side * branchLen * 0.5, by - 10,
          cx + side * branchLen, by - 5 - i * 5
        );
        ctx.stroke();
      }
    }
  }

  // 树冠
  if (stage >= 1) {
    const crownBase = baseY - height * 0.55;
    const crownSize = 14 + stage * 7;

    const shades = ['#22c55e', '#16a34a', '#15803d', '#14532d'];

    // 多层树冠
    for (let layer = 0; layer < 3; layer++) {
      if (layer > stage) continue;
      const ly = crownBase - layer * crownSize * 0.25;
      const lsize = crownSize * (0.7 + layer * 0.15);

      ctx.fillStyle = shades[Math.min(layer + stage - 2, shades.length - 1)] || shades[0];
      ctx.beginPath();
      ctx.arc(cx - lsize * 0.15, ly, lsize * 0.45, 0, Math.PI * 2);
      ctx.fill();

      if (stage >= 3) {
        ctx.fillStyle = shades[Math.min(layer + stage - 1, shades.length - 1)] || shades[1];
        ctx.beginPath();
        ctx.arc(cx + lsize * 0.2, ly - lsize * 0.1, lsize * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 发光效果 - 结果阶段
    if (stage === 5) {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.beginPath();
      ctx.arc(cx, crownBase - crownSize * 0.3, crownSize * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // 金色果实
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const dist = crownSize * 0.35;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(angle) * dist,
          crownBase - crownSize * 0.3 + Math.sin(angle) * dist * 0.6,
          3,
          0, Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  // 种子
  if (stage === 0) {
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(cx, baseY - 6, 6, 0, Math.PI * 2);
    ctx.fill();
    // 光芒
    ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
    ctx.beginPath();
    ctx.arc(cx, baseY - 6, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 获取阶段描述
function getStageLabel(stage) {
  const labels = ['种子', '发芽', '幼苗', '成长', '开花', '结果'];
  return labels[stage] || '';
}

// 获取阶段 emoji
function getStageEmoji(stage) {
  const emojis = ['🌰', '🌱', '🌿', '🪴', '🌺', '🌟'];
  return emojis[stage] || '';
}
