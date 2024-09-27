import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';

// Run npm install d3 && npm install d3-hexbin

const HoneycombPlot = ({ easyCount, mediumCount, hardCount, width = 800, height = 300 }) => {
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

      const radius = 10;
      const hexWidth = Math.sqrt(3) * radius;
      const hexHeight = 2 * radius;

      const directions = [
        [1, 0],
        [-0.5, -0.75],
        [0.5, 0.75],
        [-0.5, 0.75],
        [-1, 0],
        [0.5, -0.75]
      ];

      const hexagonPoints = [];
      const visited = new Set();
      const startX = width / 2;
      const startY = height / 2;

      hexagonPoints.push([startX, startY]);
      visited.add(`${Math.round(startX)},${Math.round(startY)}`);

      const createCluster = (clusterSize, clusterType) => {
        const clusterPoints = [];
        while (clusterPoints.length < clusterSize) {
          const randomHexagon = hexagonPoints[Math.floor(Math.random() * hexagonPoints.length)];
          const [x, y] = randomHexagon;
          const randomDirection = directions[Math.floor(Math.random() * directions.length)];
          const newX = x + randomDirection[0] * hexWidth;
          const newY = y + randomDirection[1] * hexHeight;

          if (newX >= 0 && newX <= width - hexWidth &&
            newY >= 0 && newY <= height - hexHeight &&
            !visited.has(`${Math.round(newX)},${Math.round(newY)}`)) {
            hexagonPoints.push([newX, newY]);
            clusterPoints.push([newX, newY]);
            visited.add(`${Math.round(newX)},${Math.round(newY)}`);
          }
        }
        return clusterPoints;
      };

      const clusterSizes = {
        easy: Math.max(1, Math.floor(easyCount * 0.8)),
        medium: Math.max(1, Math.floor(mediumCount * 0.8)),
        hard: Math.max(1, Math.floor(hardCount * 0.8)),
      };

      const easyCluster = createCluster(clusterSizes.easy, 'easy');
      const mediumCluster = createCluster(clusterSizes.medium, 'medium');
      const hardCluster = createCluster(clusterSizes.hard, 'hard');

      const remainingEasy = easyCount - clusterSizes.easy;
      const remainingMedium = mediumCount - clusterSizes.medium;
      const remainingHard = hardCount - clusterSizes.hard;

      const remainingQuestions = [
        ...Array(remainingEasy).fill('easy'),
        ...Array(remainingMedium).fill('medium'),
        ...Array(remainingHard).fill('hard'),
      ];

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
        let color;
        if (i < easyCluster.length) {
          color = colorMap.easy;
        } else if (i < easyCluster.length + mediumCluster.length) {
          color = colorMap.medium;
        } else if (i < easyCluster.length + mediumCluster.length + hardCluster.length) {
          color = colorMap.hard;
        } else {
          const remainingType = remainingQuestions.shift();
          color = colorMap[remainingType];
        }

        svg
          .append('path')
          .attr('d', hexbinGenerator.hexagon())
          .attr('transform', `translate(${pos[0] + radius}, ${pos[1] + radius})`)
          .attr('fill', color)
          .attr('stroke', '#FFFFFF')  // Set the stroke color to white
          .attr('stroke-width', '1px');  // Set the stroke width
      });
    };

    createHoneycombPlot();
  }, [easyCount, mediumCount, hardCount, width, height]);

  return (
    <div className='scale-75'>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default HoneycombPlot;