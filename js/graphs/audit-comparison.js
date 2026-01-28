/**
 * Renders a bar chart comparing audits done vs received
 * @param {string} containerId - DOM element ID to render into
 * @param {object} auditData - Audit statistics {totalUp, totalDown, auditRatio}
 */
export function renderAuditComparisonChart(containerId, auditData) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }
    
    const { totalUp, totalDown, auditRatio } = auditData;
    
    const width = 800;
    const height = 400;
    const padding = { top: 60, right: 40, bottom: 80, left: 150 }; // Increased left padding
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const maxValue = Math.max(totalUp, totalDown);
    const barHeight = 60;
    const barSpacing = 100;
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.maxWidth = '100%';
    svg.style.height = 'auto';
    
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chartGroup.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);
    
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 30);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '18');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Audit Comparison';
    svg.appendChild(title);
    
    // Audit Ratio display
    const ratioText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    ratioText.setAttribute('x', width / 2);
    ratioText.setAttribute('y', 50);
    ratioText.setAttribute('text-anchor', 'middle');
    ratioText.setAttribute('font-size', '14');
    ratioText.setAttribute('fill', '#667eea');
    ratioText.textContent = `Audit Ratio: ${auditRatio.toFixed(2)}`;
    svg.appendChild(ratioText);
    
    const data = [
        { label: 'Audits Done', value: totalUp, color: '#667eea', y: 0 },
        { label: 'Audits Received', value: totalDown, color: '#764ba2', y: barHeight + barSpacing }
    ];
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'graph-tooltip';
    tooltip.style.display = 'none';
    container.appendChild(tooltip);
    
    data.forEach(bar => {
        const barWidth = (bar.value / maxValue) * chartWidth;
        
        // Bar
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', 0);
        rect.setAttribute('y', bar.y);
        rect.setAttribute('width', 0); // Start at 0 for animation
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', bar.color);
        rect.setAttribute('rx', '5');
        rect.style.cursor = 'pointer';
        
        // Animate bar width
        setTimeout(() => {
            rect.setAttribute('width', barWidth);
            rect.style.transition = 'width 1s ease-out';
        }, 100);
        
        // Label (moved further left)
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', -15);
        label.setAttribute('y', bar.y + barHeight / 2 + 5);
        label.setAttribute('text-anchor', 'end');
        label.setAttribute('font-size', '14');
        label.setAttribute('font-weight', '500');
        label.setAttribute('fill', '#333');
        label.textContent = bar.label;
        chartGroup.appendChild(label);
        
        // Value label on bar
        const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valueLabel.setAttribute('x', barWidth + 10);
        valueLabel.setAttribute('y', bar.y + barHeight / 2 + 5);
        valueLabel.setAttribute('font-size', '14');
        valueLabel.setAttribute('font-weight', 'bold');
        valueLabel.setAttribute('fill', bar.color);
        valueLabel.textContent = bar.value.toLocaleString();
        chartGroup.appendChild(valueLabel);
        
        // Hover effects
        rect.addEventListener('mouseenter', (e) => {
            rect.setAttribute('opacity', '0.8');
            tooltip.innerHTML = `
                <strong>${bar.label}:</strong> ${bar.value.toLocaleString()}<br>
                <em>${((bar.value / maxValue) * 100).toFixed(1)}% of maximum</em>
            `;
            tooltip.style.display = 'block';
            tooltip.style.left = (e.pageX + 10) + 'px';
            tooltip.style.top = (e.pageY - 40) + 'px';
        });
        
        rect.addEventListener('mouseleave', () => {
            rect.setAttribute('opacity', '1');
            tooltip.style.display = 'none';
        });
        
        chartGroup.appendChild(rect);
    });
    
    svg.appendChild(chartGroup);
    container.innerHTML = '';
    container.appendChild(svg);
}
