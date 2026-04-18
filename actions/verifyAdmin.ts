'use server'

export async function verifyAdmin(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  return password === adminPassword
}
