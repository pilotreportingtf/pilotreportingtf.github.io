import { getCollection } from 'astro:content';
import { getPermalink } from './utils/permalinks';

interface NavLink {
  text?: string;
  href?: string;
  links?: NavLink[];
}

/**
 * Permalinks of pages that are marked `draft: true` and therefore are not part of a
 * production build. They are collected once here so navigation never points at a
 * page that does not exist. During `astro dev` drafts are served, so nothing is hidden.
 */
const draftPermalinks = new Set(
  import.meta.env.DEV
    ? []
    : (await getCollection('pages', ({ data }) => data.draft === true)).map(({ id }) =>
        getPermalink(id === 'index' ? '/' : `/${id}`)
      )
);

const withoutDrafts = (links: NavLink[]): NavLink[] =>
  links
    .filter(({ href }) => !href || !draftPermalinks.has(href))
    .map((link) => (link.links ? { ...link, links: withoutDrafts(link.links) } : link));

const headerLinks: NavLink[] = [
  {
    text: 'Home',
    href: getPermalink('/'),
  },
  {
    text: 'People',
    href: getPermalink('/people'),
  },
  {
    text: 'Projects',
    href: getPermalink('/projects'),
  },
  {
    text: 'Events',
    href: getPermalink('/events'),
  },
  {
    text: 'Outputs',
    href: getPermalink('/outputs'),
  },
  {
    text: 'Resources',
    href: getPermalink('/resources'),
  },
];

export const headerData = {
  links: withoutDrafts(headerLinks),
  actions: [],
};

export const footerData = {
  links: [
    // {
    //   title: 'Product',
    //   links: [
    //     { text: 'Features', href: '#' },
    //     { text: 'Security', href: '#' },
    //     { text: 'Team', href: '#' },
    //     { text: 'Enterprise', href: '#' },
    //     { text: 'Customer stories', href: '#' },
    //     { text: 'Pricing', href: '#' },
    //     { text: 'Resources', href: '#' },
    //   ],
    // },
    // {
    //   title: 'Platform',
    //   links: [
    //     { text: 'Developer API', href: '#' },
    //     { text: 'Partners', href: '#' },
    //     { text: 'Atom', href: '#' },
    //     { text: 'Electron', href: '#' },
    //     { text: 'AstroWind Desktop', href: '#' },
    //   ],
    // },
    // {
    //   title: 'Support',
    //   links: [
    //     { text: 'Docs', href: '#' },
    //     { text: 'Community Forum', href: '#' },
    //     { text: 'Professional Services', href: '#' },
    //     { text: 'Skills', href: '#' },
    //     { text: 'Status', href: '#' },
    //   ],
    // },
    // {
    //   title: 'Company',
    //   links: [
    //     { text: 'About', href: '#' },
    //     { text: 'Blog', href: '#' },
    //     { text: 'Careers', href: '#' },
    //     { text: 'Press', href: '#' },
    //     { text: 'Inclusion', href: '#' },
    //     { text: 'Social Impact', href: '#' },
    //     { text: 'Shop', href: '#' },
    //   ],
    // },
  ],
  secondaryLinks: [
    // { text: 'Terms', href: getPermalink('/terms') },
    // { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    // { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    // { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    // { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    // { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    // { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/onwidget/astrowind' },
  ],
  footNote: `
    <div class="text-center">
      <strong>Contact us: </strong> <a href="mailto:pilotreportingtf---gmail.com" id="contact-link">pilotreportingtf---gmail.com</a>
      <script type="text/javascript">document.getElementById('contact-link').textContent=document.getElementById('contact-link').textContent.replace(/---/, '@');document.getElementById('contact-link').href='mailto:'+document.getElementById('contact-link').textContent</script>
    </div>
  `,
};
