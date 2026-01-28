/**
 * Renders a pie chart for Piscine Pass/Fail ratio
 * @param {string} containerId - DOM element ID to render into
 * @param {Array} piscineData - Piscine progress data
 */
export function renderPiscineStatsChart(containerId, piscineData) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }
    
    if (!piscineData || piscineData.length === 0) {
        container.innerHTML = '<p class="graph-error">No Piscine data available</p>';
        return;
    }
    
    // Calculate pass/fail
    const passed = piscineData.filter(p => p.grade >= 1).length;
    const failed = piscineData.filter(p => p.grade === 0).length;
    const total = piscineData.length;
    
    const width = 800;
    const height = 450; // Increased height
    const centerX = width / 2;
    const centerY = 200; // Moved up
    const radius = 120;
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.maxWidth = '100%';
    svg.style.height = 'auto';
    
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', centerX);
    title.setAttribute('y', 30);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '18');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Piscine Performance';
    svg.appendChild(title);
    
    // Calculate angles
    const passPercentage = (passed / total) * 100;
    const failPercentage = (failed / total) * 100;
    const passAngle = (passed / total) * 360;
    
    // Helper function to describe arc
    function describeArc(x, y, radius, startAngle, endAngle) {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
            "M", x, y,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "Z"
        ].join(" ");
    }
    
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'graph-tooltip';
    tooltip.style.display = 'none';
    container.appendChild(tooltip);
    
    // Pass slice (green)
    if (passed > 0) {
        const passSlice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        passSlice.setAttribute('d', describeArc(centerX, centerY, radius, 0, passAngle));
        passSlice.setAttribute('fill', '#27ae60');
        passSlice.setAttribute('stroke', 'white');
        passSlice.setAttribute('stroke-width', '3');
        passSlice.style.cursor = 'pointer';
        
        passSlice.addEventListener('mouseenter', (e) => {
            passSlice.setAttribute('opacity', '0.8');
            tooltip.innerHTML = `
                <strong>Passed:</strong> ${passed} exercises<br>
                <em>${passPercentage.toFixed(1)}% success rate</em>
            `;
            tooltip.style.display = 'block';
            tooltip.style.left = (e.pageX + 10) + 'px';
            tooltip.style.top = (e.pageY - 40) + 'px';
        });
        
        passSlice.addEventListener('mouseleave', () => {
            passSlice.setAttribute('opacity', '1');
            tooltip.style.display = 'none';
        });
        
        svg.appendChild(passSlice);
    }
    
    // Fail slice (red)
    if (failed > 0) {
        const failSlice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        failSlice.setAttribute('d', describeArc(centerX, centerY, radius, passAngle, 360));
        failSlice.setAttribute('fill', '#e74c3c');
        failSlice.setAttribute('stroke', 'white');
        failSlice.setAttribute('stroke-width', '3');
        failSlice.style.cursor = 'pointer';
        
        failSlice.addEventListener('mouseenter', (e) => {
            failSlice.setAttribute('opacity', '0.8');
            tooltip.innerHTML = `
                <strong>Failed:</strong> ${failed} exercises<br>
                <em>${failPercentage.toFixed(1)}% of attempts</em>
            `;
            tooltip.style.display = 'block';
            tooltip.style.left = (e.pageX + 10) + 'px';
            tooltip.style.top = (e.pageY - 40) + 'px';
        });
        
        failSlice.addEventListener('mouseleave', () => {
            failSlice.setAttribute('opacity', '1');
            tooltip.style.display = 'none';
        });
        
        svg.appendChild(failSlice);
    }
    
    // Center text - Total number
    const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerText.setAttribute('x', centerX);
    centerText.setAttribute('y', centerY);
    centerText.setAttribute('text-anchor', 'middle');
    centerText.setAttribute('font-size', '32');
    centerText.setAttribute('font-weight', 'bold');
    centerText.setAttribute('fill', '#333');
    centerText.textContent = total;
    svg.appendChild(centerText);
    
    const centerLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerLabel.setAttribute('x', centerX);
    centerLabel.setAttribute('y', centerY + 25);
    centerLabel.setAttribute('text-anchor', 'middle');
    centerLabel.setAttribute('font-size', '12');
    centerLabel.setAttribute('fill', '#666');
    centerLabel.textContent = 'Total Exercises';
    svg.appendChild(centerLabel);
    
    // Legend - positioned below the pie chart
    const legendY = centerY + radius + 50;
    const legendSpacing = 200;
    
    // Pass legend
    const passRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    passRect.setAttribute('x', centerX - legendSpacing);
    passRect.setAttribute('y', legendY);
    passRect.setAttribute('width', 20);
    passRect.setAttribute('height', 20);
    passRect.setAttribute('fill', '#27ae60');
    passRect.setAttribute('rx', '3');
    svg.appendChild(passRect);
    
    const passText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    passText.setAttribute('x', centerX - legendSpacing + 30);
    passText.setAttribute('y', legendY + 15);
    passText.setAttribute('font-size', '14');
    passText.setAttribute('fill', '#333');
    passText.textContent = `Passed: ${passed} (${passPercentage.toFixed(1)}%)`;
    svg.appendChild(passText);
    
    // Fail legend
    const failRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    failRect.setAttribute('x', centerX + 20);
    failRect.setAttribute('y', legendY);
    failRect.setAttribute('width', 20);
    failRect.setAttribute('height', 20);
    failRect.setAttribute('fill', '#e74c3c');
    failRect.setAttribute('rx', '3');
    svg.appendChild(failRect);
    
    const failText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    failText.setAttribute('x', centerX + 50);
    failText.setAttribute('y', legendY + 15);
    failText.setAttribute('font-size', '14');
    failText.setAttribute('fill', '#333');
    failText.textContent = `Failed: ${failed} (${failPercentage.toFixed(1)}%)`;
    svg.appendChild(failText);
    
    container.innerHTML = '';
    container.appendChild(svg);
}
