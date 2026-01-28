import { transformXPProgression, formatLargeNumber, calculateYAxisTicks } from '../utils/transforms.js';

const GRAPH_CONFIG = {
    width: 800,
    height: 400,
    padding: { top: 40, right: 40, bottom: 60, left: 80 },
    colors: {
        line: '#667eea',
        gradient: ['#667eea', '#764ba2'],
        axis: '#666',
        grid: '#e0e0e0',
        tooltip: '#333'
    }
};

/**
 * Renders an XP progression line chart
 * @param {string} containerId - DOM element ID to render into
 * @param {Array} transactions - XP transaction data from GraphQL
 */
export function renderXPProgressionChart(containerId, transactions) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }
    
    // Transform data
    const data = transformXPProgression(transactions);
    
    if (data.length === 0) {
        container.innerHTML = '<p class="graph-error">No XP data available</p>';
        return;
    }
    
    const { width, height, padding } = GRAPH_CONFIG;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Calculate scales
    const maxXP = Math.max(...data.map(d => d.xp));
    const yTicks = calculateYAxisTicks(maxXP);
    const maxY = yTicks[yTicks.length - 1];
    
    const xScale = (index) => (index / (data.length - 1)) * chartWidth;
    const yScale = (value) => chartHeight - (value / maxY) * chartHeight;
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.maxWidth = '100%';
    svg.style.height = 'auto';
    
    // Create gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'xpGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', GRAPH_CONFIG.colors.gradient[0]);
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', GRAPH_CONFIG.colors.gradient[1]);
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    // Main group for chart
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chartGroup.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);
    
    // Draw Y-axis grid lines and labels
    yTicks.forEach(tick => {
        const y = yScale(tick);
        
        // Grid line
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', 0);
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('x2', chartWidth);
        gridLine.setAttribute('y2', y);
        gridLine.setAttribute('stroke', GRAPH_CONFIG.colors.grid);
        gridLine.setAttribute('stroke-width', '1');
        chartGroup.appendChild(gridLine);
        
        // Label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', -10);
        label.setAttribute('y', y + 5);
        label.setAttribute('text-anchor', 'end');
        label.setAttribute('font-size', '12');
        label.setAttribute('fill', GRAPH_CONFIG.colors.axis);
        label.textContent = formatLargeNumber(tick);
        chartGroup.appendChild(label);
    });
    
    // Draw line path
    const pathData = data.map((d, i) => {
        const x = xScale(i);
        const y = yScale(d.xp);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'url(#xpGradient)');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-linecap', 'round');
    chartGroup.appendChild(path);
    
    // Draw data points with hover effect
    const tooltip = document.createElement('div');
    tooltip.className = 'graph-tooltip';
    tooltip.style.display = 'none';
    container.appendChild(tooltip);
    
    data.forEach((d, i) => {
        const x = xScale(i);
        const y = yScale(d.xp);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '5');
        circle.setAttribute('fill', GRAPH_CONFIG.colors.line);
        circle.setAttribute('stroke', 'white');
        circle.setAttribute('stroke-width', '2');
        circle.style.cursor = 'pointer';
        
        // Hover effects
        circle.addEventListener('mouseenter', (e) => {
            circle.setAttribute('r', '7');
            tooltip.innerHTML = `
                <strong>Date:</strong> ${d.date}<br>
                <strong>Total XP:</strong> ${d.xp.toLocaleString()}
            `;
            tooltip.style.display = 'block';
            tooltip.style.left = (e.pageX + 10) + 'px';
            tooltip.style.top = (e.pageY - 40) + 'px';
        });
        
        circle.addEventListener('mouseleave', () => {
            circle.setAttribute('r', '5');
            tooltip.style.display = 'none';
        });
        
        chartGroup.appendChild(circle);
    });
    
    // X-axis labels (show first, middle, last dates)
    const xLabelIndices = [0, Math.floor(data.length / 2), data.length - 1];
    xLabelIndices.forEach(i => {
        if (i < data.length) {
            const d = data[i];
            const x = xScale(i);
            
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', chartHeight + 30);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', '12');
            label.setAttribute('fill', GRAPH_CONFIG.colors.axis);
            label.textContent = new Date(d.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            chartGroup.appendChild(label);
        }
    });
    
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 25);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '18');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', GRAPH_CONFIG.colors.tooltip);
    title.textContent = 'XP Progression Over Time';
    svg.appendChild(title);
    
    // Y-axis label
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('transform', `translate(20, ${height / 2}) rotate(-90)`);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('font-size', '14');
    yLabel.setAttribute('fill', GRAPH_CONFIG.colors.axis);
    yLabel.textContent = 'Total XP';
    svg.appendChild(yLabel);
    
    svg.appendChild(chartGroup);
    container.innerHTML = '';
    container.appendChild(svg);
}
