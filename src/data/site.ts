// Values the site does not know yet are null; the UI hides anything that depends on them
// (docs/STATUS.md, Waiting on Rigan).
export const site = {
  name: 'VeraStack Labs',
  url: 'https://verastack-labs.github.io',
  title: 'VeraStack Labs: web experiences, apps and 3D on the web',
  description:
    'A design and engineering studio. We build web experiences, web and mobile apps, content systems and 3D on the web for clients, and our own products alongside them.',
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
  // Google Search Console ownership (HTML tag method). Keep it: removing it unverifies the site.
  googleSiteVerification: 'Khv1EH0oq--r11Gxhsk82I4RJZJJ0wiL1JjTxQNXurU',
}

// Where every "book a 20-min call" goes: the Cal.com page once it exists, until then an email to
// the studio asking for a call. The button is always shown.
export const booking = site.calLink
  ? { href: site.calLink, external: true }
  : site.email
    ? {
        href: `mailto:${site.email}?subject=${encodeURIComponent('20-min call')}&body=${encodeURIComponent(
          "Hi, I'd like to book a 20-minute call. A couple of times that suit me:\n\n",
        )}`,
        external: false,
      }
    : { href: '#contact', external: false }
