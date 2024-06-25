import React, { useEffect } from 'react';
import { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

function CodesChart() {

    const {data} = useContext(DataContext);

    useEffect(() => {
        console.log(data)
    },[data])

  return (
    <div>CodesChart</div>
  )
}

export default CodesChart