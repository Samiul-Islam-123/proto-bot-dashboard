import { SignIn } from '@clerk/clerk-react'
import React from 'react'

function SigninComponent() {
  return (
    <div style={{
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        height : "100vh"
    }}>
        <SignIn />
    </div>
  )
}

export default SigninComponent