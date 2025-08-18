import { NextResponse } from 'next/server'
import { readUserDataFromCookies, hasUserDataInCookies } from '@/lib/cookieReader'

export async function GET() {
  try {
    const hasData = await hasUserDataInCookies()
    
    if (!hasData) {
      return NextResponse.json({
        success: true,
        hasData: false,
        message: 'No user data found'
      })
    }
    
    const userData = await readUserDataFromCookies()
    
    return NextResponse.json({
      success: true,
      hasData: true,
      userData,
      message: 'User data retrieved successfully'
    })
  } catch (error) {
    console.error('Error reading user data:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to read user data' },
      { status: 500 }
    )
  }
}
