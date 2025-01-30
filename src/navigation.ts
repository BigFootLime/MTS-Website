import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
   
    {
      text: 'Pages',
      links: [
        {
          text: 'Services',
          href: getPermalink('/services'),
        },
        {
          text: 'Qui sommes-nous',
          href: getPermalink('/about'),
        },
        {
          text: 'Terms',
          href: getPermalink('/terms'),
        },
        {
          text: 'Politique de confidentialité',
          href: getPermalink('/privacy'),
        },
      ],
    },
    {
      text: 'Blog',
      links: [
        
        {
          text: 'Mes réalisations',
          href: getBlogPermalink(),
        },
      ],
    },
    {
      text: 'Tarification',
      href: getPermalink('/pricing'),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
  
};

export const footerData = {
  links: [
    {
      title: 'Pages',
      links: [
        { text: 'Services', href: getPermalink('/services') },
        { text: 'Qui sommes-nous', href: getPermalink('/about') },
        { text: 'Terms', href: getPermalink('/terms') },
        { text: 'Politique de confidentialité', href: getPermalink('/privacy') },
      ],
    },
    {
      title: 'Blog',
      links: [
      
        { text: 'Mes réalisations', href: getBlogPermalink() },
      ],
    },
    {
      title: 'Autres',
      links: [
        { text: 'Tarification', href: getPermalink('/pricing') },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/BigFootLime' },
  ],
  
};
