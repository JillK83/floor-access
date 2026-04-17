'use server'

export async function verifyAdmin(pin: string) {
  const adminPassword = process.env.ADMIN_PASSWORD
  return pin === adminPassword
}
