import React, { useEffect, useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import Api from '../../service/api';
import Loading from '../ui/Loading';

function DetailsChart(props) {
    const [startDate, endDate] = props.date;
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [keys, setKeys] = useState([]);
    useEffect(() => {
        if (startDate !== null && endDate !== null) {
            setIsLoading(true);
            Api.admin.getOverview({ startDate: startDate, endDate: endDate, type: 'childCatalog' })
                .then(result => {
                    return result.json();
                })
                .then(data => {
                    // console.log(data);
                    const newOverview = [];
                    const keysValue = [];
                    const overview = data.overview;
                    overview.map(o => {
                        keysValue.push(o.name);
                        let index = newOverview.findIndex(e => { return e.parent === o.parent });
                        if (index >= 0) {
                            newOverview[index][o.name] = o.turnovers;
                        } else {
                            newOverview.push({
                                parent: o.parent,
                                [o.name]: o.turnovers,
                            });
                        }

                    });
                    setData(newOverview);
                    setKeys(keysValue);
                    setIsLoading(false);
                    // console.log(newOverview);
                })
        }
    }, [endDate]);


    const options = {
        data: data,
        title: {
            text: 'Shopping Online',
        },
        subtitle: {
            text: 'Turnovers (VNĐ)',
        },
        series: [{
            type: 'column',
            xKey: 'parent',
            yKeys: keys,
            // label: {},
        }],
        theme: {
            baseTheme: 'ag-default',
            palette: {
                fills: [
                    "AliceBlue",
                    "Beige",
                    "CornflowerBlue",
                    "DarkGoldenRod",
                    "FireBrick",
                    "Gainsboro",
                    "HoneyDew",
                    "IndianRed",
                    "Khaki",
                    "LightCyan",
                ],
                strokes: ['black']
            }
        },
    }


    return (
        <>
            {isLoading && <Loading />}
            {!isLoading && <AgChartsReact options={options} />}
        </>
    );
}

export default DetailsChart