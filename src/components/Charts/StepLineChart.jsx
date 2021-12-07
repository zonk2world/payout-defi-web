import React from "react";
import Chart from "chart.js";

class StepLineChart extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidUpdate() {
        // this.myChart.data.labels = this.props.data.map((d) => d.label);
        // this.myChart.data.datasets[0].data = this.props.data.map(
        //     (d) => d.value
        // );
        // this.myChart.update();
    }

    componentDidMount() {
        this.myChart = new Chart(this.canvasRef.current, {
            type: "line",
            options: {
                responsive: true,
                title: {
                    display: false
                }
            },
            data: {
                labels: [
                    "Oct 18",
                    "Oct 19",
                    "Oct 20",
                    "Oct 21",
                    "Oct 22",
                    "Oct 23"
                ],
                datasets: [
                    {
                        label: "Stable",
                        data: [7.8, 7.8, 6.3, 6.3, 6.3, 6.3],
                        borderColor: "#8E24AA",
                        steppedLine: true,
                        fill: false
                    }
                ]
            }
        });
    }

    render() {
        return <canvas ref={this.canvasRef}/>;
    }
}

export default StepLineChart;
