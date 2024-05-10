import React, { useEffect, useState } from 'react'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import Timezone from './Timezone';
import axios from 'axios';

const Calendar = () => {
    const [prevData, setPrevData] = useState()
    const [currentweek, setcurrentweek] = useState()
    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long', // Full month name (e.g., May)
        day: 'numeric', // Day of the month (e.g., 8)
        year: 'numeric' // Full year (e.g., 2024)
    });

    const getCurrentWeekNumber = () => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const diff = now - startOfYear;
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        const weekNumber = Math.floor(diff / oneWeek);
        return weekNumber;
    }
    useEffect(() => {
        setcurrentweek(getCurrentWeekNumber())

    }, [])
    const handleprevweek = async () => {
        setcurrentweek(currentweek - 1)
        const res = await axios.get("http://localhost:5000/preweeks", {
            params: {
                weekNumber: currentweek - 1
            }
        });
        setPrevData(res.data)
    }

    const hanleNextchange = async () => {
        setcurrentweek(currentweek + 1)
        const res = await axios.get("http://localhost:5000/nextweeks", {
            params: {
                weekNumber: currentweek - 1
            }
        });
        setPrevData(res.data)

    }
    return (
        <div>
            <div className='flex flex-row justify-around'>
                <div className='flex flex-row justify-start'>
                    <FaArrowAltCircleLeft className='mt-2 ml-1' />
                    <button onClick={handleprevweek}>
                        Previous Week
                    </button>
                </div>
                <p className=''>{currentDate}</p>
                <div className='flex flex-row justify-start'>
                    <button onClick={hanleNextchange}> Next Week</button>
                    <FaArrowAltCircleRight className='mt-2 ml-1' />
                </div>
            </div>
            <Timezone prevData={prevData} />
        </div>
    )
}

export default Calendar