import React from 'react'
import { Link } from 'react-router-dom'
export default function Sidebar(){
  return (
    <nav style={{width:220, borderRight:'1px solid #ddd', padding:10}}>
      <h3>Panel</h3>
      <ul style={{listStyle:'none', padding:0}}>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  )
}