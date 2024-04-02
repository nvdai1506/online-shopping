import React, { useEffect, useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import Api from '../../service/api';
import Loading from '../ui/Loading';

function HistoryChart(props) {
    // const [startDate, endDate] = props.date;
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [keys, setKeys] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        Api.admin.getHistory()
            .then(result => {
                return result.json();
            })
            .then(data => {
                setData(data.history);
                setIsLoading(false);
            })
    }, []);


    // const data = [
    //     {
    //         turnovers: 120,
    //         month: 1
    //     },
    //     {
    //         turnovers: 200,
    //         month: 2
    //     },
    //     {
    //         turnovers: 300,
    //         month: 3
    //     },
    //     {
    //         turnovers: 100,
    //         month: 4
    //     },
    //     {
    //         turnovers: 700,
    //         month: 5
    //     },
    //     {
    //         turnovers: 1000,
    //         month: 6
    //     },
    //     {
    //         turnovers: 50,
    //         month: 7
    //     },
    //     {
    //         turnovers: 150,
    //         month: 8
    //     },
    //     {
    //         turnovers: 150,
    //         month: 9
    //     },
    //     {
    //         turnovers: 150,
    //         month: 10
    //     },
    //     {
    //         turnovers: 150,
    //         month: 11
    //     },
    //     {
    //         turnovers: 150,
    //         month: 12
    //     }
    // ]
    const options = {
        title: {
            text: 'Histogram',
        },
        subtitle: {
            text: 'Total Income',
        },
        data: data,
        series: [
            {
                type: 'column',
                xKey: 'month',
                xName: 'Month',
                yKey: 'turnovers',
                label: {},
            },
        ],
        legend: {
            enabled: false,
        },
        axes: [
            {
                type: 'category',
                position: 'bottom',
                title: { text: 'Months' },
            },
            {
                type: 'number',
                position: 'left',
                title: { text: 'Amount of Money' },
            },
        ],
    }


    return (
        <>
            {/* <AgChartsReact options={options} /> */}
            {isLoading && <Loading />}
            {!isLoading && <AgChartsReact options={options} />}
        </>
    );
}

export default HistoryChart