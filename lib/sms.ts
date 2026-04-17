export const openSMS = (phone: string, body: string) => {
  const link = document.createElement('a')
  link.href = `sms:${phone}&body=${encodeURIComponent(body)}`
  link.click()
}
