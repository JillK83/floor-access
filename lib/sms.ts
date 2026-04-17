export const openSMS = (phone: string, body: string): boolean => {
  const userAgent = navigator.userAgent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  
  if (isMobile) {
    // This works across both iOS and Android more reliably
    const separator = /iPhone|iPad|iPod/.test(userAgent) ? '&' : '?'
    const link = document.createElement('a')
    link.href = `sms:${phone}${separator}body=${encodeURIComponent(body)}`
    link.click()
    return true
  }

  // On desktop, we handle the copy in the component logic for feedback
  return false
}
