// Values the site does not know yet are null; the UI hides anything that depends on them
// (docs/STATUS.md, Waiting on Rigan).
export const site = {
  name: 'VeraStack Labs',
  url: 'https://verastack.dev',
  title: 'VeraStack Labs: sites, apps, films and AI search for launches',
  description:
    'A design and engineering studio for launches: brand, sites, apps and 3D experiences, launch films and the AI search (AEO and GEO), SEO and marketing that get them found.',
  // Every email on the site reads from here: footer, contact and the form's fallback.
  email: 'rigan@verastack.dev' as string | null,
  // The 30-minute intro call on Cal.com (a 15-minute one is at cal.com/verastack/quick).
  calLink: 'https://cal.com/verastack/intro' as string | null,
  // Web3Forms access key for the enquiry form (spec 7.4). Public by design; the form cannot send
  // until it is set.
  formAccessKey: '83e439b1-16f2-4897-b789-225cdd314194' as string | null,
  formEndpoint: 'https://api.web3forms.com/submit',
  // Web3Forms' shared hCaptcha site key (free plan). hCaptcha is switched on for the form in the
  // Web3Forms dashboard, so every submission must carry a token.
  hcaptchaSiteKey: '50b2fe65-b00b-4b9e-ad62-3ba471098be2' as string | null,
  // Placeholder promise until confirmed.
  replyPromise: 'within two working days',
  availability: null as string | null,
  githubUrl: 'https://github.com/verastack-labs',
  founderName: 'Rigan Burnwal',
  founderUrl: 'https://riganb.github.io',
  basedIn: 'India',
  // Google Search Console ownership (HTML tag method). Keep it: removing it unverifies the site.
  googleSiteVerification: 'Khv1EH0oq--r11Gxhsk82I4RJZJJ0wiL1JjTxQNXurU',
  // Cloudflare Web Analytics beacon for verastack.dev: cookieless visit counts. Public by design;
  // null turns it off. The dashboard is under Web analytics in the Cloudflare account.
  analyticsToken: '0627ce9905824942893b1850c5f9f426' as string | null,
}

// Where every "book a 30-min call" goes: the Cal.com page once it exists, until then an email to
// the studio asking for a call. The button is always shown.
export const booking = site.calLink
  ? { href: site.calLink, external: true }
  : site.email
    ? {
        href: `mailto:${site.email}?subject=${encodeURIComponent('30-min call')}&body=${encodeURIComponent(
          "Hi, I'd like to book a 30-minute call. A couple of times that suit me:\n\n",
        )}`,
        external: false,
      }
    : { href: '#contact', external: false }

// The link-preview image. Pages that set their own openGraph must list it again, since Next
// replaces the whole openGraph object rather than merging it.
export const shareImage = { url: '/og.png', width: 1200, height: 630, alt: site.title }
