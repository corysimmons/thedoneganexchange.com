// ~/components/CookieChecker.tsx
'use client'

import { useEffect, useState } from 'react'
import LogoutButton from '~/components/LogoutButton'

const CookieChecker = () => {
  const [hasCookie, setHasCookie] = useState(false)

  useEffect(() => {
    const checkCookie = async () => {
      const cookieStore = await fetch('/api/check-cookie') // You'd need an API route to handle this
      const result = await cookieStore.json()
      setHasCookie(result.hasToken)
    }

    checkCookie() // Initial check

    const interval = setInterval(() => {
      checkCookie()
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  return hasCookie ? <LogoutButton /> : null
}

export default CookieChecker
