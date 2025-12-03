import { Badge, BadgeType, BadgeRarity, BadgeCategory, Guide, FaqItem } from '../types';

export const BADGES: Badge[] = [
  // Earnable Achievements
  {
    id: 'starstruck',
    name: 'Starstruck',
    emoji: '⭐',
    description: 'Create a repository that captures the community\'s attention.',
    howToEarn: 'Have a repository that receives stars.',
    type: BadgeType.ACHIEVEMENT,
    rarity: BadgeRarity.COMMON,
    category: BadgeCategory.COMMUNITY,
    tiers: [
      { name: 'Base', requirement: '16 stars', threshold: 16 },
      { name: 'Bronze', requirement: '128 stars', threshold: 128 },
      { name: 'Silver', requirement: '512 stars', threshold: 512 },
      { name: 'Gold', requirement: '4096 stars', threshold: 4096 }
    ]
  },
  {
    id: 'quickdraw',
    name: 'Quickdraw',
    emoji: '⚡',
    description: 'Fastest fingers in the west.',
    howToEarn: 'Close an issue or pull request within 5 minutes of opening it.',
    type: BadgeType.ACHIEVEMENT,
    rarity: BadgeRarity.RARE,
    category: BadgeCategory.WORKFLOW,
    notes: 'This is a one-time achievement.'
  },
  {
    id: 'pair-extraordinaire',
    name: 'Pair Extraordinaire',
    emoji: '👯',
    description: 'Collaborate with others on code.',
    howToEarn: 'Co-author commits in a merged pull request.',
    type: BadgeType.ACHIEVEMENT,
    rarity: BadgeRarity.COMMON,
    category: BadgeCategory.CONTRIBUTION,
    tiers: [
      { name: 'Base', requirement: '10 points', threshold: 10 },
      { name: 'Bronze', requirement: '24 points', threshold: 24 },
      { name: 'Silver', requirement: '48 points', threshold: 48 },
      { name: 'Gold', requirement: '1024 points', threshold: 1024 }
    ]
  },
  {
    id: 'pull-shark',
    name: 'Pull Shark',
    emoji: '🦈',
    description: 'The lifeblood of open source.',
    howToEarn: 'Have pull requests merged.',
    type: BadgeType.ACHIEVEMENT,
    rarity: BadgeRarity.COMMON,
    category: BadgeCategory.CONTRIBUTION,
    tiers: [
      { name: 'Base', requirement: '2 PRs', threshold: 2 },
      { name: 'Bronze', requirement: '16 PRs', threshold: 16 },
      { name: 'Silver', requirement: '128 PRs', threshold: 128 },
      { name: 'Gold', requirement: '1024 PRs', threshold: 1024 }
    ]
  },
  {
    id: 'galaxy-brain',
    name: 'Galaxy Brain',
    emoji: '🧠',
    description: 'Providing the answers everyone needs.',
    howToEarn: 'Have your answers accepted in GitHub Discussions.',
    type: BadgeType.ACHIEVEMENT,
    rarity: BadgeRarity.RARE,
    category: BadgeCategory.COMMUNITY,
    tiers: [
      { name: 'Base', requirement: '2 answers', threshold: 2 },
      { name: 'Bronze', requirement: '8 answers', threshold: 8 },
      { name: 'Silver', requirement: '16 answers', threshold: 16 },
      { name: 'Gold', requirement: '32 answers', threshold: 32 }
    ]
  },
  {
    id: 'yolo',
    name: 'YOLO',
    emoji: '🚀',
    description: 'Living dangerously.',
    howToEarn: 'Merge a pull request without code review.',
    type: BadgeType.ACHIEVEMENT,
    rarity: BadgeRarity.LEGENDARY,
    category: BadgeCategory.WORKFLOW,
    notes: 'Requires a repository that enforces code review (Pro/Team feature) where you force merge as admin.'
  },
  {
    id: 'public-sponsor',
    name: 'Public Sponsor',
    emoji: '💖',
    description: 'Supporting the ecosystem.',
    howToEarn: 'Sponsor an open source contributor via GitHub Sponsors.',
    type: BadgeType.ACHIEVEMENT,
    rarity: BadgeRarity.COMMON,
    category: BadgeCategory.COMMUNITY
  },
  // Highlights
  {
    id: 'github-pro',
    name: 'GitHub Pro',
    emoji: '🔶',
    description: 'Member of GitHub Pro.',
    howToEarn: 'Subscribe to GitHub Pro plan.',
    type: BadgeType.HIGHLIGHT,
    rarity: BadgeRarity.COMMON,
    category: BadgeCategory.MEMBERSHIP
  },
  {
    id: 'developer-program',
    name: 'Developer Program Member',
    emoji: '🛠️',
    description: 'Registered developer program member.',
    howToEarn: 'Register for the GitHub Developer Program (free).',
    type: BadgeType.HIGHLIGHT,
    rarity: BadgeRarity.COMMON,
    category: BadgeCategory.MEMBERSHIP
  },
  {
    id: 'security-bounty',
    name: 'Security Bug Bounty Hunter',
    emoji: '🐛',
    description: 'Helping keep GitHub secure.',
    howToEarn: 'Find and report a valid security vulnerability in GitHub.',
    type: BadgeType.HIGHLIGHT,
    rarity: BadgeRarity.LEGENDARY,
    category: BadgeCategory.SECURITY
  },
  // Retired/Unreleased
  {
    id: 'arctic-code-vault',
    name: 'Arctic Code Vault Contributor',
    emoji: '❄️',
    description: 'Code preserved for future generations.',
    howToEarn: 'Contributed to specific repos before 02/02/2020.',
    type: BadgeType.RETIRED,
    rarity: BadgeRarity.EPIC,
    category: BadgeCategory.SPECIAL,
    notes: 'Retired / Legacy'
  },
  {
    id: 'mars-2020',
    name: 'Mars 2020 Contributor',
    emoji: '🚁',
    description: 'Code that flies on another planet.',
    howToEarn: 'Contributed to repositories used in the Mars 2020 Helicopter mission.',
    type: BadgeType.RETIRED,
    rarity: BadgeRarity.LEGENDARY,
    category: BadgeCategory.SPECIAL,
    notes: 'Retired / Legacy'
  },
  {
    id: 'heart-on-sleeve',
    name: 'Heart On Your Sleeve',
    emoji: '👕',
    description: 'Unreleased achievement.',
    howToEarn: 'Not currently obtainable.',
    type: BadgeType.RETIRED,
    rarity: BadgeRarity.RARE,
    category: BadgeCategory.SPECIAL,
    notes: 'Unreleased'
  }
];

export const GUIDES: Guide[] = [
  {
    id: 'guide-quickdraw',
    title: 'How to earn "Quickdraw" ⚡',
    badgeId: 'quickdraw',
    steps: [
      { title: 'Create a Repository', description: 'Create a temporary public repository.' },
      { title: 'Open an Issue', description: 'Create a new issue with any title.' },
      { title: 'Close Immediately', description: 'Immediately click the "Close issue" button. It must be done within 5 minutes.' },
      { title: 'Wait', description: 'The badge should appear on your profile within a few hours.' }
    ],
    tips: ['You can also do this with a Pull Request, but an Issue is faster.', 'Ensure the repo is public.']
  },
  {
    id: 'guide-galaxy-brain',
    title: 'How to earn "Galaxy Brain" 🧠',
    badgeId: 'galaxy-brain',
    steps: [
      { title: 'Find a Discussion', description: 'Find a repository that uses GitHub Discussions (e.g., Next.js, Vercel repos).' },
      { title: 'Answer a Question', description: 'Look for "Unanswered" questions in the Q&A category.' },
      { title: 'Get Accepted', description: 'The original poster must mark your reply as the "Answer".' },
      { title: 'Repeat', description: 'You need 2 accepted answers for the Base tier.' }
    ],
    tips: ['You can enable Discussions on your own repo and answer questions from others, but do not sock-puppet accounts (it violates TOS).']
  }
];

export const FAQS: FaqItem[] = [
  {
    question: "Can I hide achievements from my profile?",
    answer: "Yes. Click on the achievement on your profile, and there is a toggle to hide it. It will remain in your list but won't be visible to others."
  },
  {
    question: "How do private achievements work?",
    answer: "Achievements earned in private repositories will show up as 'Private contributions' if you have enabled private contributions in your profile settings. The specific repo details will be hidden."
  },
  {
    question: "Why hasn't my achievement appeared yet?",
    answer: "Achievements are processed asynchronously. It can take anywhere from a few minutes to 24 hours for a badge to appear. Also, ensure your contributions are associated with the email address on your GitHub account."
  },
  {
    question: "Can achievements disappear?",
    answer: "Generally no, unless the repository you contributed to is deleted or made private (and you don't show private contribs), or if the criteria are revoked (e.g., an accepted answer is unmarked)."
  }
];

export const FULL_CONTEXT = `
You are an assistant for the "GitHub Badge Hunter" app. Your goal is to help users understand how to get specific GitHub badges.
Here is the complete database of badges:
${JSON.stringify(BADGES)}

Here are some guides:
${JSON.stringify(GUIDES)}

Here are common FAQs:
${JSON.stringify(FAQS)}

Rules:
1. Be helpful and enthusiastic.
2. If asked about a badge not in the list, state it might not exist or might be new.
3. Keep answers concise.
4. Use the emojis associated with the badges.
`;
