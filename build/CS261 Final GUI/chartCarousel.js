// chartCarousel.js - Implementation for the chart comparison carousel

/**
 * Chart Comparison Carousel
 * 
 * This module adds a chart carousel to the junction simulator that allows users
 * to compare the current configuration with historical data.
 */

// Configuration options
const CHART_CONFIG = {
  chartTypes: [
    {
      id: 'meanWaitTime',
      title: 'Mean Wait Time',
      yLabel: 'Time (seconds)',
      dataLabel: 'Mean Wait Time'
    },
    {
      id: 'maxWaitTime',
      title: 'Maximum Wait Time',
      yLabel: 'Time (seconds)',
      dataLabel: 'Max Wait Time'
    },
    {
      id: 'queueLength',
      title: 'Queue Length',
      yLabel: 'Number of Cars',
      dataLabel: 'Queue Length'
    },
    {
      id: 'performanceScore',
      title: 'Performance Score',
      yLabel: 'Score',
      dataLabel: 'Performance'
    },
    {
      id: 'environmentalScore',
      title: 'Environmental Score',
      yLabel: 'Score',
      dataLabel: 'Environmental Impact'
    }
  ],
  numSampleRuns: 10, // Number of previous runs to display
  currentRunLabel: 'Current Configuration'
};

// Global variables
let activeChart = null; // Currently active Chart.js instance
let currentChartIndex = 0;
let isCarouselVisible = false;
let currentViewContext = 'main'; // 'main' or 'editor'

/**
 * Initializes the chart carousel
 */
function initChartCarousel() {
  console.log('Initializing chart carousel');
  
  // Create chart carousel HTML
  createChartCarouselHTML();
  
  // Add event listeners
  document.getElementById('compareButton').addEventListener('click', function() {
    showChartCarousel('main');
  });
  
  document.getElementById('editorCompareButton').addEventListener('click', function() {
    showChartCarousel('editor');
  });
  
  document.getElementById('closeChartButton').addEventListener('click', hideChartCarousel);
  
  document.getElementById('prevChartButton').addEventListener('click', function() {
    navigateChart(-1);
  });
  
  document.getElementById('nextChartButton').addEventListener('click', function() {
    navigateChart(1);
  });
  
  // Add click handlers to indicators
  document.querySelectorAll('.chart-indicator').forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      if (currentChartIndex !== index) {
        navigateToChart(index);
      }
    });
  });
}

/**
 * Creates the HTML structure for the chart carousel
 */
function createChartCarouselHTML() {
  const carouselHTML = `
    <section id="chart-carousel" class="view-container chart-carousel-container">
      <div class="container-fluid p-0 h-100">
        <div class="row h-100">
          <div class="col-12 chart-content-area">
            <button id="closeChartButton" class="close-chart-button readable" aria-label="Close chart view">
              <i class="fas fa-times"></i>
            </button>
            
            <h2 id="chartTitle" class="chart-title text-center readable">Chart Comparison</h2>
            
            <div class="chart-carousel-wrapper">
              <button id="prevChartButton" class="chart-nav-button prev-button readable" aria-label="Previous chart">
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <div class="chart-display-area">
                <canvas id="comparisonChart"></canvas>
              </div>
              
              <button id="nextChartButton" class="chart-nav-button next-button readable" aria-label="Next chart">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div class="chart-indicators">
              ${CHART_CONFIG.chartTypes.map((chart, index) => 
                `<span class="chart-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  
  // Append to the main element
  document.querySelector('main').insertAdjacentHTML('beforeend', carouselHTML);
  
  // Add CSS to head
  const carouselCSS = `
    <style>
        .chart-carousel-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 58.33%; /* col-7 width */
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8); /* Use theme background color */
            z-index: 1000; /* Higher z-index to ensure it's above everything else */
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            padding: 20px;
            /* Add box shadow for subtle depth */
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            /* Ensure this covers everything behind it */
            backdrop-filter: blur(2px); /* Optional: slight blur effect for better visibility */
        }
        
        .chart-carousel-container.visible {
        opacity: 1;
        pointer-events: auto;
        }
      
      .chart-content-area {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      
      .close-chart-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--button-light-bg);
        color: var(--button-light-text);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 2;
      }
      
      .chart-title {
        margin: 15px 0;
        color: var(--text-primary);
      }
      
      .chart-carousel-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-grow: 1;
        width: 100%;
      }
      
      .chart-nav-button {
        background: var(--button-light-bg);
        color: var(--button-light-text);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      
      .chart-display-area {
        flex-grow: 1;
        height: 100%;
        padding: 0 20px;
        max-height: 80vh;
      }
      
      .chart-indicators {
        display: flex;
        justify-content: center;
        margin-top: 15px;
      }
      
      .chart-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: var(--button-light-bg);
        margin: 0 5px;
        cursor: pointer;
      }
      
      .chart-indicator.active {
        background-color: var(--button-primary-bg);
      }
      
      /* Responsive adjustments */
      @media (max-width: 992px) {
        .chart-carousel-container {
          width: 100%;
          left: 0;
          right: 0;
          height: 100%;
          z-index: 1000;
        }
      }
      
      /* Ensure chart canvas is responsive */
      #comparisonChart {
        width: 100% !important;
        height: 100% !important;
        max-height: 60vh;
      }
    </style>
  `;
  
  document.head.insertAdjacentHTML('beforeend', carouselCSS);
}

/**
 * Generates sample data for charts
 * @param {string} chartType - The type of chart to generate data for
 * @returns {Object} Object containing labels and data for previous runs and current run
 */
function generateSampleData(chartType) {
  const labels = Array.from({ length: CHART_CONFIG.numSampleRuns }, (_, i) => `Run ${i + 1}`);
  labels.push(CHART_CONFIG.currentRunLabel);
  
  // Generate random values
  const previousRuns = Array.from({ length: CHART_CONFIG.numSampleRuns }, () => {
    // Different ranges for different chart types
    switch (chartType) {
      case 'meanWaitTime':
        return Math.floor(Math.random() * 60) + 20; // 20-80 seconds
      case 'maxWaitTime':
        return Math.floor(Math.random() * 90) + 30; // 30-120 seconds
      case 'queueLength':
        return Math.floor(Math.random() * 20) + 5; // 5-25 cars
      case 'performanceScore':
      case 'environmentalScore':
        return Math.floor(Math.random() * 60) + 20; // 20-80 score
      default:
        return Math.floor(Math.random() * 100);
    }
  });
  
  // Current run is the last item, but displayed separately
  const currentRunValue = (() => {
    switch (chartType) {
      case 'meanWaitTime':
        return Math.floor(Math.random() * 60) + 20;
      case 'maxWaitTime':
        return Math.floor(Math.random() * 90) + 30;
      case 'queueLength':
        return Math.floor(Math.random() * 20) + 5;
      case 'performanceScore':
      case 'environmentalScore':
        return Math.floor(Math.random() * 60) + 20;
      default:
        return Math.floor(Math.random() * 100);
    }
  })();
  
  // Create an array with nulls for previous runs and the value only for current run
  const currentRun = Array(CHART_CONFIG.numSampleRuns).fill(null);
  currentRun.push(currentRunValue);
  
  return {
    labels,
    previousRuns,
    currentRun
  };
}

/**
 * Creates a new chart
 * @param {number} index - Index of the chart type to create
 */
function createChart(index) {
  // Destroy previous chart if it exists
  if (activeChart) {
    activeChart.destroy();
    activeChart = null;
  }
  
  const chartType = CHART_CONFIG.chartTypes[index];
  const ctx = document.getElementById('comparisonChart').getContext('2d');
  const data = generateSampleData(chartType.id);
  
  // Update chart title
  document.getElementById('chartTitle').textContent = 
    `${currentViewContext === 'editor' ? 
      `${document.getElementById('editorDirectionLabel')?.textContent || 'Direction'}bound` : 
      'Junction'} ${chartType.title}`;
  
  // Create new chart
  activeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Previous Runs',
        data: data.previousRuns,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }, {
        label: CHART_CONFIG.currentRunLabel,
        data: data.currentRun,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: chartType.title,
          font: {
            size: 18
          },
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
        },
        legend: {
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
          }
        },
        y: {
          title: {
            display: true,
            text: chartType.yLabel,
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
          }
        }
      }
    }
  });
  
  // Update current chart index
  currentChartIndex = index;
  
  // Update indicator dots
  updateChartIndicators();
}

/**
 * Updates chart indicators to show the current active chart
 */
function updateChartIndicators() {
  // Remove active class from all indicators
  document.querySelectorAll('.chart-indicator').forEach((indicator) => {
    indicator.classList.remove('active');
  });
  
  // Add active class to current indicator
  const currentIndicator = document.querySelector(`.chart-indicator[data-index="${currentChartIndex}"]`);
  if (currentIndicator) {
    currentIndicator.classList.add('active');
  }
}

/**
 * Shows the chart carousel
 * @param {string} context - 'main' or 'editor' indicating which view triggered the carousel
 */
function showChartCarousel(context) {
  currentViewContext = context;
  isCarouselVisible = true;
  
  const carouselContainer = document.getElementById('chart-carousel');
  carouselContainer.classList.add('visible');
  
  // Create the first chart
  createChart(0);
  
  console.log(`Chart carousel shown in ${context} context`);
}

/**
 * Hides the chart carousel
 */
function hideChartCarousel() {
  isCarouselVisible = false;
  
  const carouselContainer = document.getElementById('chart-carousel');
  carouselContainer.classList.remove('visible');
  
  // Destroy the chart to free up resources
  if (activeChart) {
    activeChart.destroy();
    activeChart = null;
  }
  
  console.log('Chart carousel hidden');
}

/**
 * Navigates to the next or previous chart
 * @param {number} direction - 1 for next, -1 for previous
 */
function navigateChart(direction) {
  // Calculate new index with wraparound
  const newIndex = (currentChartIndex + direction + CHART_CONFIG.chartTypes.length) % CHART_CONFIG.chartTypes.length;
  
  // Navigate to the new chart
  navigateToChart(newIndex);
}

/**
 * Navigates to a specific chart by index
 * @param {number} index - Index of the chart to show
 */
function navigateToChart(index) {
  // Create the new chart (this will destroy the previous one)
  createChart(index);
}

/**
 * Updates chart colors based on current light/dark mode
 */
function updateChartColors() {
  if (!activeChart) return;
  
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
  const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
  
  // Update chart colors
  activeChart.options.plugins.title.color = textColor;
  activeChart.options.plugins.legend.labels.color = textColor;
  activeChart.options.scales.x.ticks.color = textColor;
  activeChart.options.scales.x.grid.color = borderColor;
  activeChart.options.scales.y.ticks.color = textColor;
  activeChart.options.scales.y.grid.color = borderColor;
  activeChart.options.scales.y.title.color = textColor;
  
  // Apply changes
  activeChart.update();
}

/**
 * Handler for dark mode toggle to update chart colors
 */
function handleThemeChange() {
  if (isCarouselVisible && activeChart) {
    updateChartColors();
  }
}

// Initialize the chart carousel when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing chart carousel...');
  
  // Ensure Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.log('Chart.js not found, loading dynamically...');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = function() {
      console.log('Chart.js loaded successfully');
      initChartCarousel();
    };
    script.onerror = function() {
      console.error('Failed to load Chart.js');
    };
    document.head.appendChild(script);
  } else {
    console.log('Chart.js already loaded');
    initChartCarousel();
  }
  
  // Listen for theme changes
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', handleThemeChange);
  }
});