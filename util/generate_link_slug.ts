// program to generate random strings

const CHARS ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const SLUG_LENGTH = 5;

export default function generatePaymentLinkSlug(): string {
  let result = '';
  const charactersLength = CHARS.length;
  for ( let i = 0; i < SLUG_LENGTH; i++ ) {
    result += CHARS.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
