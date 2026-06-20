import React, { useEffect, useRef } from 'react';

const PieChart = ({ principal, totalInterest }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dimensions setup for High-DPI screens
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const centerX = width / 2;
    const centerY = height / 2;
    // Set radius dynamically
    const radius = Math.min(width, height) / 2 - 10;

    const total = principal + totalInterest;
    if (total === 0) {
      // Draw empty circle
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
      return;
    }

    const interestRatio = totalInterest / total;
    const interestAngle = interestRatio * 2 * Math.PI;

    const colorPrincipal = '#1c3f94'; // Digital HeroesC dark blue
    const colorInterest = '#6ea3e5';  // Digital HeroesC light blue

    // Draw Interest Slice (start at -Math.PI / 2 to start from top)
    const startAngle = -Math.PI / 2;
    const midAngle = startAngle + interestAngle;

    ctx.fillStyle = colorInterest;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, midAngle);
    ctx.closePath();
    ctx.fill();

    // Draw Principal Slice
    ctx.fillStyle = colorPrincipal;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, midAngle, startAngle + 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    // Draw white slice lines to separate cleanly
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(startAngle), centerY + radius * Math.sin(startAngle));
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(midAngle), centerY + radius * Math.sin(midAngle));
    ctx.stroke();

  }, [principal, totalInterest]);

  return (
    <div className="pie-chart-container" style={{ width: '150px', height: '150px', flexShrink: 0 }}>
      <canvas ref={canvasRef} style={{ width: '150px', height: '150px', display: 'block' }} />
    </div>
  );
};

export default PieChart;
