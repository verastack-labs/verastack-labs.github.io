// Values the site does not know yet are null; the UI hides anything that depends on them
// (docs/STATUS.md, Waiting on Rigan).
export const site = {
  name: 'VeraStack Labs',
  url: 'https://verastack-labs.github.io',
  title: 'VeraStack Labs: configurators, commerce and launch sites',
  description:
    'A design and engineering studio. We build configurators, commerce and launch sites for clients, and our own products alongside them.',
  // Every email on the site reads from here: footer, contact and the form's fallback.
  email: 'therealriganb@gmail.com' as string | null,
  calLink: null as string | null,
  // Web3Forms access key for the enquiry form (spec 7.4). Public by design; the form cannot send
  // until it is set.
  formAccessKey: null as string | null,
  formEndpoint: 'https://api.web3forms.com/submit',
  // Placeholder promise until confirmed.
  replyPromise: 'within two working days',
  availability: null as string | null,
  githubUrl: 'https://github.com/verastack-labs',
  founderName: 'Rigan Burnwal',
  founderUrl: 'https://riganb.github.io',
  basedIn: 'India',
}
