import React, { useEffect, useState } from 'react';
import * as agCharts from 'ag-charts-community';
import { AgChartsReact } from 'ag-charts-react';
import Api from '../../service/api';
import Loading from '../ui/Loading';


function OverviewChart(props) {
    
    const [startDate, endDate] = props.date;
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (startDate !== null && endDate !== null) {
            setIsLoading(true);
            Api.admin.getOverview({ startDate: startDate, endDate: endDate, type: 'catalog' })
                .then(result => {
                    return result.json();
                })
                .then(data => {
                    // console.log(data.overview);
                    setData(data.overview);
                    setIsLoading(false);
                })
        }
    }, [endDate]);

    const total = data.reduce((sum, d) => sum + d['turnovers'], 0);
    const numFormatter = new Intl.NumberFormat('en-US');
    const options = {
        autoSize: true,
        data,
        title: {
            text: 'Sales Figures',
            fontSize: 18,
        },
        subtitle: {
            text: '',
        },
        series: [
            {
                type: 'pie',
                calloutLabelKey: 'name',
                fillOpacity: 0.9,
                strokeWidth: 0,
                angleKey: 'turnovers',
                sectorLabelKey: 'turnovers',
                calloutLabel: {
                    enabled: false,
                },
                sectorLabel: {
                    color: 'white',
                    fontWeight: 'bold',
                    formatter: ({ datum, sectorLabelKey }) => {
                        const value = datum[sectorLabelKey];
                        return numFormatter.format(value);
                    },
                },
                title: {
                    text: 'TurnOver (VND)',
                },
                fills: [
                    '#49afda',
                    '#57cc8b',
                    '#fb7451',
                    '#3988dc',
                    '#72508c',
                    '#b499b5',
                    '#b7b5ba',
                    '#f4b944',
                ],
                innerRadiusRatio: 0.5,
                innerLabels: [
                    {
                        text: numFormatter.format(total),
                        fontSize: 24,
                        fontWeight: 'bold',
                    },
                    {
                        text: 'Total',
                        fontSize: 16,
                    },
                ],
                highlightStyle: {
                    item: {
                        fillOpacity: 0,
                        stroke: '#535455',
                        strokeWidth: 1,
                    },
                },
                tooltip: {
                    renderer: ({ datum, calloutLabelKey, title, sectorLabelKey }) => {
                        return {
                            title,
                            content: `${datum[calloutLabelKey]}: ${numFormatter.format(
                                datum[sectorLabelKey]
                            )}`,
                        };
                    },
                },
            },
        ],
    };

    return (
        <>
            {/* <Loading /> */}
            {isLoading && <Loading />}
            {!isLoading && <AgChartsReact options={options} />}
        </>
    );
}

export default React.memo(OverviewChart);