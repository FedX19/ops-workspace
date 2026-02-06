// Whitelist of allowed email addresses
export const ALLOWED_EMAILS = [
  'federowt@gmail.com',
  'tim@tmfholdings.com',
]

export function isAllowedEmail(email) {
  return ALLOWED_EMAILS.includes(email.toLowerCase().trim())
}
