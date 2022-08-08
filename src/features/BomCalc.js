import { useEffect, useState } from 'react';
import './BomCalc.css';

const USED_FIELDS = ['No.', 'Description', 'Quantity', 'Unit Price Excl. VAT', 'Discounted Unit Price', 'Line Amount Excl. VAT'];

function BomCalc() {
    const [rawData, setRawData] = useState('');
    const [discount, setDiscount] = useState('');
    const [indexes, setIndexes] = useState([]);

    useEffect(() => {
        setUpIndexes();
    }, [rawData]);

    function setUpIndexes() {
        const heads = getRows()[0].split(/\t+/g);
        let _indexes = [];
        heads.forEach((head, index) => {
            if (!!USED_FIELDS.some(item => item === head)) {
                _indexes.push(index);
            }
        });
        setIndexes(_indexes);
    }

    function pasteData() {
        navigator.clipboard.readText().then(text => {
            setRawData(text);
            setDiscount('');
        }).catch(err => {
            setRawData('');
            alert(err);
        });
    }

    function getRows() {
        return rawData.split(/\n/g);
    }

    function getTableHeads() {
        if (indexes.length === 0) return [];

        const heads = getRows()[0].split(/\t+/g);
        return heads.filter((_, index) => indexes.some(i => i === index));
    }

    function getBodyRows() {
        if (indexes.length === 0) return [];

        const bodyRows = getRows().slice(1);
        const tableHeads = getTableHeads();
        return bodyRows.map(row => {
            const columns = row.split(/\t/g).filter((_, index) => indexes.some(i => i === index));
            let columnsObj = {};
            tableHeads.forEach((head, index) => {
                columnsObj[head] = columns[index];
            });
            return columnsObj;
        });
    }

    function getTotalValue() {
        if (getBodyRows().length === 0) return 0;
        const itemPrices = getBodyRows().reduce((prev, curr) => {
            const value = parseFloat(curr['Unit Price Excl. VAT'].replace(',', ''));
            const qty = parseInt(curr['Quantity']);
            const v = Number.isNaN(value) ? 0 : value * qty;
            return prev + v;
        }, 0);
        return itemPrices;
    }

    function calculateDiscount(event) {
        const poPrice = event.target.value;
        const totalValue = getTotalValue();
        const discount = 100 * (totalValue - poPrice) / totalValue;
        setDiscount(discount.toFixed(5));
    }

    function copyDiscount() {
        navigator.clipboard.writeText(discount);
    }

    return (
        <div className='bom-calc'>
            <button onClick={pasteData}>Paste data</button>

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
            </div>
            <div className='bom-total-value-container'>
                <span className='bom-total-value'>Total Value: <span>{getTotalValue().toFixed(2)}</span></span>
                <input id='po-price' placeholder='PO Price' type='number' onChange={calculateDiscount} />
                <span className='discount'>Discount: <span>{discount}</span></span>
                <button onClick={copyDiscount}>Copy</button>
            </div>
        </div>
    );
}

export default BomCalc;