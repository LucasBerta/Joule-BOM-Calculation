import { useState } from 'react';
import './BomCalc.css';

function BomCalc() {
    const [rawData, setRawData] = useState('');

    function handleOnRawDataChange(event) {
        setRawData(event.target.value);
    }

    function getRows() {
        return rawData.split(/\n/g);
    }

    function getTableHeads() {
        const heads = getRows()[0].split(/\t+/g);
        return heads;
    }

    function getBodyRows() {
        const bodyRows = getRows().slice(1);
        const tableHeads = getTableHeads();
        return bodyRows.map((row, index) => {
            const columns = row.split(/\t/g);
            let columnsObj = {};
            tableHeads.forEach((head, index) => {
                columnsObj[head] = columns[index];
            });
            return columnsObj;
        });
    }

    function getTotalValue() {
        const itemPrices = getBodyRows().reduce((prev, curr) => {
            const value = parseFloat(curr['Unit Price Excl. VAT'].replace(',', ''));
            const v = Number.isNaN(value) ? 0 : value;
            return prev + v;
        }, 0);
        return itemPrices;
    }

    return (
        <div className='bom-calc'>
            <textarea id='raw-data' placeholder='Paste NAV lines here' value={rawData} onChange={handleOnRawDataChange} />

            <div className='table-content'>
                <table className='bom-calc-table'>
                    <thead>
                        <tr>
                            {getTableHeads().map(head => (
                                <th key={head}>{head}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {getBodyRows().map((row, index) => (
                            <tr key={index}>
                                {Object.keys(row).map(key => (
                                    <td key={key}>{row[key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <span className='bom-total-value'>Total Value: {getTotalValue().toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

export default BomCalc;