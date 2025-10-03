import React from 'react'
export default function Header({user}){
  return (
    <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <div>Student Panel</div>
      <div>{user ? `${user.name}` : '...'}</div>
    </header>
  )
}