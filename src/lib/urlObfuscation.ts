// Simple base64 encoding/decoding
export function encodeValue(value: string): string {
  if (typeof window !== 'undefined') {
    // Client-side
    return btoa(value);
  } else {
    // Server-side (Node.js)
    return Buffer.from(value).toString('base64');
  }
}

export function decodeValue(encodedValue: string): string {
  if (typeof window !== 'undefined') {
    // Client-side
    return atob(encodedValue);
  } else {
    // Server-side (Node.js)
    return Buffer.from(encodedValue, 'base64').toString();
  }
}

// Obfuscated parameter mapping
export const OBFUSCATED_PARAMS = {
  // Original names -> obfuscated names
  gender: 'x',
  age: 'y', 
  location: 'z'
} as const;

export const REVERSE_OBFUSCATED_PARAMS = {
  // Obfuscated names -> original names
  x: 'gender',
  y: 'age',
  z: 'location'
} as const;

// Encode URL parameters
export function encodeUrlParams(params: Record<string, string>): Record<string, string> {
  const encoded: Record<string, string> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (OBFUSCATED_PARAMS[key as keyof typeof OBFUSCATED_PARAMS]) {
      const obfuscatedKey = OBFUSCATED_PARAMS[key as keyof typeof OBFUSCATED_PARAMS];
      encoded[obfuscatedKey] = encodeValue(value);
    }
  });
  
  return encoded;
}

// Decode URL parameters
export function decodeUrlParams(params: Record<string, string>): Record<string, string> {
  const decoded: Record<string, string> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (REVERSE_OBFUSCATED_PARAMS[key as keyof typeof REVERSE_OBFUSCATED_PARAMS]) {
      const originalKey = REVERSE_OBFUSCATED_PARAMS[key as keyof typeof REVERSE_OBFUSCATED_PARAMS];
      decoded[originalKey] = decodeValue(value);
    }
  });
  
  return decoded;
}
