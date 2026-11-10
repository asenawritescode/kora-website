// What happens from "Set up your shop" to a working workspace, in order. One
// list for the Cloud page and the template page, so they cannot drift apart.
// Checked against Kigae Cloud's signup (kora-cloud#39): the choice screen, then
// the account form, then an email to confirm, then sign-in.
export const SIGNUP_STEPS = [
  { title: 'Choose what your business needs', body: 'Pick the modules you want. Zana shows what comes with each one and why.' },
  { title: 'Create your account', body: 'Enter your name, email, a password and your business name.' },
  { title: 'Confirm your email', body: 'We send you an email. Open it to confirm the address is yours.' },
  { title: 'Open your workspace', body: 'Sign in to a workspace with the modules you chose.' },
]
