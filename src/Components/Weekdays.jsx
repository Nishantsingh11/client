import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
const WeeklyWorkingDays = ({ prevdata }) => {
    const [dayss, setDayss] = useState([])
    const [count, setCount] = useState(1);
    const [times, setTimes] = useState([]);
    const [datafromdb, setDatafromdb] = useState([]);
    const [isChecked, setIsChecked] = useState(false);


    console.log("line 10", typeof (datafromdb));


    useEffect(() => {
        axios.get('http://localhost:5000/current')
            .then((response) => {
                console.log(response);
                setDayss(response.data.weekdays)
                setDatafromdb(JSON.parse(response.data.dataData));
                console.log("line 19", typeof (datafromdb));
                const timesData = response.data.timeData;
                if (timesData && timesData.length > 0) {
                    try {
                        const parsedTimes = JSON.parse(timesData);
                        setTimes(parsedTimes);
                    } catch (error) {
                        console.error('Error parsing times data:', error);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])
    console.log(datafromdb);

    console.log(Array.isArray(datafromdb));
    console.log(typeof (datafromdb));





    useEffect(() => {
        if (prevdata) {
            // Map prevdata to the format expected by your component
            const formattedData = prevdata.map(day => ({
                dayName: day.dayName,
                month: day.monthName,
                day: day.date
            }));
            setDayss(formattedData);
            console.log(Array.isArray(formattedData))
        } else {
            axios.get('http://localhost:5000/current')
                .then((response) => {
                    setDayss(response.data.weekdays);
                    const timesData = response.data.data;
                    if (timesData && timesData.times) {
                        setTimes(timesData.times);
                    } else {
                        console.error('Times data not found in response:', response.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [prevdata]); // Ensure that useEffect runs when prevdata changes



    // Group times into three rows
    const timesArray = times?.times || [];

    const rowCount = 3;
    const rowSize = Math.ceil(timesArray.length / rowCount);
    if (!timesArray || !Array.isArray(timesArray)) {
        console.error('Invalid times data format:', timesArray);
        return null; // Or handle the error appropriately
    }

    const groupedTimes = Array.from({ length: rowCount }, (_, rowIndex) =>
        timesArray.slice(rowIndex * rowSize, (rowIndex + 1) * rowSize)
    );


    const sendDataToServer = async (checkedData) => {
        try {
            const response = await axios.post("http://localhost:5000/checked", checkedData);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    const handleCheck = (e) => {
        const dateTime = e.target.id.split('-');
        const Month = dateTime[1];
        const day = dateTime[2];
        const time = dateTime[3];
        const date = `${Month}-${day}-2024`;
    
        // Update isChecked based on the current state in datafromdb
        const isChecked = datafromdb.some(item => item.date === date && item.time === time && item.isChecked);
    
        const name = generateName();
        const newCheckedData = { date, time, name };
    
        // Update the isChecked state in datafromdb
        setDatafromdb(prevData => {
            return prevData.map(item => {
                if (item.date === date && item.time === time) {
                    return { ...item, isChecked: !isChecked };
                }
                return item;
            });
        });
    
        // Send the data to the server
        sendDataToServer(newCheckedData);
    };
    







    const generateName = () => {
        const newId = `test ${count}`;
        setCount(count + 1);
        return newId;
    };


    return (
        <>
            <div>
                <h2>Weekly Working Days and Times</h2>
                {dayss?.map(day => (
                    <div className='text-center'>
                        <h3>{day.dayName}-{day.month}-{day.day}</h3>
                        <div className="flex justify-center items-center h-48">
                            <table>
                                <tbody>
                                    {groupedTimes?.map((row, index) => (
                                        <tr key={index}>
                                            {row?.map(time => {
                                                const dateTimeId = `${day.dayName}-${day.month}-${day.day}-${time}`;
                                                const isChecked = datafromdb?.some(item => item.date === `${day.month}-${day.day}-2024` && item.time === time);

                                                return (
                                                    <td key={time}>
                                                        <input
                                                            type="checkbox"
                                                            id={dateTimeId}
                                                            onChange={handleCheck}
                                                            checked={isChecked}
                                                        />

                                                        <label htmlFor={dateTimeId}>{time}</label>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default WeeklyWorkingDays;
