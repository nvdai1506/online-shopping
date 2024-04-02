import React from 'react'


import AuthForm from '../components/auth/AuthForm';
function Auth({loginMode}) {
  return (
    <div>
      <AuthForm loginMode={loginMode}/>
    </div>
  )
}

export default Auth