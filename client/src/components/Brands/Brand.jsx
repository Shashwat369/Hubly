import React from 'react'
import Adobe from '../../assets/Adobe.png'
import elastic from '../../assets/elastic.png'
import opendoor from '../../assets/opendoor.png'
import Airtable from '../../assets/Airtable.png'
import Framer from '../../assets/Framer.png'
import './Brand.css'

const Brand = () => {
  return (
    <div className='Brands'>
        <img src={Adobe} alt="Adobe_Logo" />
        <img src={elastic} alt="Elastic_Logo" />
        <img src={opendoor} alt="Opendoor_Logo" />
        <img src={Airtable} alt="Airtable_Logo" />
        <img src={elastic} alt="Elastic_Logo" />
        <img src={Framer} alt="Framer_Logo" />
    </div>
  )
}

export default Brand