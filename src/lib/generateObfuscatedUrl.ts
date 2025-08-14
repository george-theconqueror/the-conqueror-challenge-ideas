import { encodeUrlParams } from './urlObfuscation'

/**
 * Generate an obfuscated URL with encoded parameters
 * Useful for testing and generating shareable links
 */
export function generateObfuscatedUrl(
  baseUrl: string,
  params: { gender?: string; age?: number; location?: string }
): string {
  // Filter out undefined values and convert to strings
  const stringParams: Record<string, string> = {}
  if (params.gender) stringParams.gender = params.gender
  if (params.age) stringParams.age = params.age.toString()
  if (params.location) stringParams.location = params.location
  
  // Encode the parameters
  const encodedParams = encodeUrlParams(stringParams)
  
  // Build the query string
  const queryString = Object.entries(encodedParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

/**
 * Example usage:
 * generateObfuscatedUrl('http://localhost:3000', {
 *   gender: 'male',
 *   age: 25,
 *   location: 'NYC'
 * })
 * 
 * Returns: http://localhost:3000?x=bWFsZQ%3D%3D&y=MjU%3D&z=TllD
 */

// Test the function with your specific parameters
if (require.main === module) {
  const testUrl = generateObfuscatedUrl('http://localhost:3000', {
    gender: 'male',
    age: 22,
    location: 'Romania'
  })
  
  console.log('🔗 Original parameters:')
  console.log('  gender: male')
  console.log('  age: 22')
  console.log('  location: Romania')
  console.log('\n🔗 Generated obfuscated URL:')
  console.log(testUrl)
  console.log('\n🔗 You can now test this URL in your browser!')
}
