export type OrderFormValues = {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  province: string
  postalCode: string
  country: string
}

export type OrderFormErrors = Partial<Record<keyof OrderFormValues, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+\d][\d\s()-]{7,}$/
const POSTAL_CODE_PATTERN = /^\d{4}$/

export const EMPTY_ORDER_FORM: OrderFormValues = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'South Africa',
}

export function validateOrderForm(
  values: OrderFormValues,
): OrderFormErrors {
  const errors: OrderFormErrors = {}

  if (values.fullName.trim().length < 2) {
    errors.fullName = 'Enter your full name.'
  }

  if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = 'Enter a valid contact number.'
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (values.address.trim().length < 5) {
    errors.address = 'Enter your street address.'
  }

  if (values.city.trim().length < 2) {
    errors.city = 'Enter your city.'
  }

  if (values.province.trim().length < 2) {
    errors.province = 'Enter your province.'
  }

  if (!POSTAL_CODE_PATTERN.test(values.postalCode.trim())) {
    errors.postalCode = 'Enter a 4-digit South African postal code.'
  }

  if (values.country.trim().length < 2) {
    errors.country = 'Enter your country.'
  }

  return errors
}