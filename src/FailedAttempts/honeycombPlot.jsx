import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
const HoneycombPlot = ({ easyCount, mediumCount, hardCount, width = 800, height = 600 }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const createHoneycombPlot = () => {
      const totalCount = easyCount + mediumCount + hardCount;
      const questionTypes = [
        ...Array(easyCount).fill('easy'),
        ...Array(mediumCount).fill('medium'),
        ...Array(hardCount).fill('hard'),
      ];

      d3.shuffle(questionTypes);

      const colorMap = {
        easy: '#F9A500',
        medium: '#CD8DFF',
        hard: '#13A4E3',
      };

      const radius = 20; 
      const hexWidth = Math.sqrt(3) * radius;
      const hexHeight = 2 * radius;

      const directions = [
        [1, 0],    
        [-0.5, 0.75],   
        [-1, 0],  
        [0.5, -0.75]    
      ];

      const hexagonPoints = [];
      const visited = new Set();
      const startX = Math.random() * (width - hexWidth);
      const startY = Math.random() * (height - hexHeight);
      
      hexagonPoints.push([startX, startY]);
      visited.add(`${Math.round(startX)},${Math.round(startY)}`);

      while (hexagonPoints.length < totalCount) {
        const randomHexagon = hexagonPoints[Math.floor(Math.random() * hexagonPoints.length)];
        const [x, y] = randomHexagon;
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        const newX = x + randomDirection[0] * hexWidth;
        const newY = y + randomDirection[1] * hexHeight;

        if (newX >= 0 && newX <= width - hexWidth &&
            newY >= 0 && newY <= height - hexHeight &&
            !visited.has(`${Math.round(newX)},${Math.round(newY)}`)) {
          hexagonPoints.push([newX, newY]);
          visited.add(`${Math.round(newX)},${Math.round(newY)}`);
        }
      }

      d3.select(svgRef.current).selectAll('*').remove();

      const svg = d3
        .select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

      const hexbinGenerator = hexbin()
        .radius(radius)
        .x(d => d[0])
        .y(d => d[1]);

      hexagonPoints.forEach((pos, i) => {
        const color = colorMap[questionTypes[i % questionTypes.length]];

        svg
          .append('path')
          .attr('d', hexbinGenerator.hexagon())
          .attr('transform', `translate(${pos[0] + radius}, ${pos[1] + radius})`)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', '1px');
      });
    };

    createHoneycombPlot();
  }, [easyCount, mediumCount, hardCount, width, height]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default HoneycombPlot;
