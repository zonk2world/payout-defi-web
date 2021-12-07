import React from "react";
import Chart from "chart.js";

class DoughnutChart extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidUpdate() {
        this.myChart.data.labels = this.props.data.map((d) => d.label);
        this.myChart.data.datasets[0].data = this.props.data.map(
            (d) => d.value
        );
        this.myChart.update();
    }

    componentDidMount() {
        this.myChart = new Chart(this.canvasRef.current, {
            type: "doughnut",
            options: {
                maintainAspectRatio: false
            },
            data: {
                labels: this.props.data.map((d) => d.label),
                datasets: [
                    {
                        data: this.props.data.map((d) => d.value),
                        backgroundColor: this.props.colors
                    }
                ]
            }
        });
    }

    render() {
        return <canvas ref={this.canvasRef}/>;
    }
}

export default DoughnutChart;
