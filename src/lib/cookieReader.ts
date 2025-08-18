import { cookies } from 'next/headers'

export interface StoredUserData {
  gender?: string
  age?: number
  location?: string
}

/**
 * Read user data from cookies set by middleware
 * This function reads the individual cookies that were set by the middleware
 */
export async function readUserDataFromCookies(): Promise<StoredUserData> {
  const cookieStore = await cookies()
  
  const userData: StoredUserData = {}
  
  // Read individual cookies
  const genderCookie = cookieStore.get('ideas-gender')
  const ageCookie = cookieStore.get('ideas-age')
  const locationCookie = cookieStore.get('ideas-location')
  
  if (genderCookie?.value) {
    userData.gender = genderCookie.value
  }
  
  if (ageCookie?.value) {
    const age = parseInt(ageCookie.value, 10)
    if (!isNaN(age)) {
      userData.age = age
    }
  }
  
  if (locationCookie?.value) {
    userData.location = locationCookie.value
  }
  
  return userData
}

/**
 * Check if user data exists in cookies
 */
export async function hasUserDataInCookies(): Promise<boolean> {
  const userData = await readUserDataFromCookies()
  return Object.keys(userData).length > 0
}

/**
 * Get a specific user data value from cookies
 */
export async function getUserDataFromCookies<T extends keyof StoredUserData>(
  key: T
): Promise<StoredUserData[T] | undefined> {
  const userData = await readUserDataFromCookies()
  return userData[key]
}

/**
 * Clear user data cookies
 */
export async function clearUserDataCookies(): Promise<void> {
  const cookieStore = await cookies()
  
  // Clear the cookies by setting them with expired dates
  cookieStore.delete('ideas-gender')
  cookieStore.delete('ideas-age')
  cookieStore.delete('ideas-location')
}
