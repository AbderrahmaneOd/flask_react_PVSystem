import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { LinearScale, CategoryScale } from 'chart.js';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale, zoomPlugin);

const ChartComponent = ({ label, data }) => {
    useEffect(() => {
        const ctx = document.getElementById(label).getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'boxplot',
            data: {
                labels: [label],
                datasets: [{
                    label: label,
                    data: [data],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    itemRadius: 1,
                }]
            },
            options: {
                plugins: {
                    zoom: {
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true
                            },
                            mode: 'xy',
                        }
                    }
                }
            }
        });

        return () => {
            myChart.destroy(); // Cleanup
        };
    }, [label, data]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">{label}</h3>
            <div style={{ height: '300px', width: '100%' }}>
                <canvas id={label}></canvas>
            </div>
        </div>
    );
};

export default ChartComponent;
