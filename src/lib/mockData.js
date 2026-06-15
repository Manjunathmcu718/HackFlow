export const hackathons = [
  {
    id: "1",
    title: "BeetleX Web3 Builders Hackathon 2025",
    tagline: "Build the decentralized future. Ship real products. Win big.",
    description: "Welcome to BeetleX 2025, where builders from around the globe converge to push the boundaries of Web3, AI, and decentralized technology. Over 2 weeks, you'll collaborate with fellow innovators, get mentorship from industry leaders, and ship real products that could reshape the internet as we know it.",
    status: "active",
    start_date: "2025-07-01",
    end_date: "2025-07-16",
    registration_deadline: "2025-06-30",
    submission_deadline: "2025-07-14T23:59:00",
    judging_date: "2025-07-15",
    results_date: "2025-07-16",
    max_team_size: 4,
    min_team_size: 1,
    participant_count: 2847,
    team_count: 56,
    submission_count: 142,
    leaderboard_published: true,
    tracks: [
      { name: "DeFi & Payments", description: "Reimagine finance with decentralized protocols, wallets, and payment rails.", prize: "$5,000" },
      { name: "AI x Blockchain", description: "Build AI agents, on-chain inference, and verifiable ML models.", prize: "$5,000" },
      { name: "Gaming & Metaverse", description: "Create immersive experiences, NFT games, and virtual worlds.", prize: "$5,000" },
      { name: "Infrastructure & Tooling", description: "Developer tools, scaling solutions, and protocol improvements.", prize: "$5,000" },
    ],
    prizes: [
      { place: "Grand Prize", amount: "$10,000", description: "Best overall project across all tracks" },
      { place: "1st Place per Track", amount: "$5,000", description: "Top project in each technology track" },
      { place: "Best UI/UX", amount: "$2,500", description: "Most polished and user-friendly interface" },
      { place: "Community Choice", amount: "$2,500", description: "Voted by fellow participants" },
    ],
    rules: "All code must be written during the hackathon. Open-source libraries and frameworks are allowed. Teams of 1-4 members. Plagiarism will result in immediate disqualification.",
    eligibility: "Open to developers 18+. All skill levels welcome. Participants from any country can join (virtual event).",
    faqs: [
      { question: "Do I need Web3 experience?", answer: "No! We welcome developers of all backgrounds with workshops and mentors." },
      { question: "Can I participate solo?", answer: "Yes, solo participation is allowed." },
      { question: "Is it free?", answer: "Participation is completely free." },
      { question: "When are results announced?", answer: "July 16 during our virtual closing ceremony." },
    ],
    sponsors: [
      { name: "Ethereum Foundation", tier: "platinum" },
      { name: "Polygon", tier: "gold" },
      { name: "Chainlink", tier: "gold" },
      { name: "Alchemy", tier: "silver" },
      { name: "The Graph", tier: "silver" },
    ],
  },
  {
    id: "2",
    title: "AI Agents Hackathon",
    tagline: "Build autonomous AI agents that solve real problems.",
    description: "A weekend sprint focused on building intelligent AI agents.",
    status: "upcoming",
    start_date: "2025-09-01",
    end_date: "2025-09-03",
    registration_deadline: "2025-08-25",
    submission_deadline: "2025-09-03T18:00:00",
    judging_date: "2025-09-04",
    results_date: "2025-09-05",
    max_team_size: 3,
    min_team_size: 1,
    participant_count: 512,
    team_count: 20,
    submission_count: 0,
    leaderboard_published: false,
    tracks: [
      { name: "Autonomous Agents", description: "Build self-directed AI agents for real-world tasks.", prize: "$3,000" },
      { name: "AI Safety", description: "Tools and frameworks for safe AI deployment.", prize: "$3,000" },
    ],
    prizes: [
      { place: "Grand Prize", amount: "$3,000", description: "Best overall AI agent" },
      { place: "Runner Up", amount: "$1,000", description: "Second place" },
    ],
    rules: "Use any AI API or open-source model. Must be built during the hackathon.",
    eligibility: "Open to all developers.",
    faqs: [],
    sponsors: [],
  },
  {
    id: "3",
    title: "DeFi Summer Buildathon",
    tagline: "The ultimate DeFi building competition.",
    description: "Build the next generation of decentralized finance applications.",
    status: "closed",
    start_date: "2025-01-15",
    end_date: "2025-02-01",
    registration_deadline: "2025-01-10",
    submission_deadline: "2025-02-01T23:59:00",
    judging_date: "2025-02-02",
    results_date: "2025-02-05",
    max_team_size: 5,
    min_team_size: 1,
    participant_count: 3200,
    team_count: 85,
    submission_count: 210,
    leaderboard_published: true,
    tracks: [
      { name: "Lending & Borrowing", description: "Innovative credit and lending protocols.", prize: "$4,000" },
      { name: "DEX & AMM", description: "Next-gen decentralized exchange mechanisms.", prize: "$4,000" },
    ],
    prizes: [
      { place: "Grand Prize", amount: "$8,000", description: "Best DeFi project" },
      { place: "Top Track", amount: "$4,000", description: "Best per track" },
    ],
    rules: "All projects must be open source.",
    eligibility: "Open to all.",
    faqs: [],
    sponsors: [],
  },
];

export const registrations = [
  { id: "r1", hackathon_id: "1", participant_name: "Alex Chen", email: "alex@dev.io", organization: "MIT", role_title: "Full Stack Dev", track: "DeFi & Payments", team_name: "ChainBreakers", status: "confirmed", registration_id: "BX-000001" },
  { id: "r2", hackathon_id: "1", participant_name: "Priya Sharma", email: "priya@dev.io", organization: "Stanford", role_title: "Frontend Engineer", track: "DeFi & Payments", team_name: "ChainBreakers", status: "confirmed", registration_id: "BX-000002" },
  { id: "r3", hackathon_id: "1", participant_name: "Sarah Kim", email: "sarah@ai.co", organization: "UC Berkeley", role_title: "ML Engineer", track: "AI x Blockchain", team_name: "Neural Nodes", status: "confirmed", registration_id: "BX-000003" },
  { id: "r4", hackathon_id: "1", participant_name: "Luna Martinez", email: "luna@game.dev", organization: "CMU", role_title: "Game Developer", track: "Gaming & Metaverse", team_name: "MetaVerse Builders", status: "confirmed", registration_id: "BX-000004" },
];

export const teams = [
  {
    id: "t1", hackathon_id: "1", name: "ChainBreakers", invite_code: "CB-2025-X7K", track: "DeFi & Payments", submission_status: "submitted",
    members: [
      { name: "Alex Chen", email: "alex@dev.io", role: "Team Lead" },
      { name: "Priya Sharma", email: "priya@dev.io", role: "Frontend" },
    ],
  },
];

export const submissions = [
  {
    id: "s1", hackathon_id: "1", team_id: "t1", team_name: "ChainBreakers",
    project_title: "DeFi Shield", description: "AI-powered rug pull detection and smart contract analyzer for DeFi protocols.",
    tech_stack: ["Solidity", "React", "Python", "TensorFlow"], demo_url: "https://defishield.demo.com",
    github_url: "https://github.com/chainbreakers/defishield", pitch_deck_url: "", video_url: "https://youtube.com/watch?v=abc",
    track: "DeFi & Payments", status: "submitted", is_draft: false,
    scores: [{ judge_name: "Judge A", innovation: 9, technical: 8, impact: 9, presentation: 8, total: 34, comments: "Solid architecture" }],
    average_score: 34,
  },
  {
    id: "s2", hackathon_id: "1", team_id: "t2", team_name: "Neural Nodes",
    project_title: "ChainGPT", description: "On-chain AI inference engine for smart contracts.",
    tech_stack: ["Rust", "Solana", "PyTorch"], demo_url: "https://chaingpt.demo.com",
    github_url: "https://github.com/neuralnodes/chaingpt", pitch_deck_url: "", video_url: "",
    track: "AI x Blockchain", status: "submitted", is_draft: false,
    scores: [{ judge_name: "Judge A", innovation: 10, technical: 9, impact: 8, presentation: 7, total: 34, comments: "Incredible tech" }],
    average_score: 34,
  },
  {
    id: "s3", hackathon_id: "1", team_id: "t3", team_name: "MetaVerse Builders",
    project_title: "Nexus World", description: "A decentralized metaverse with NFT land ownership.",
    tech_stack: ["Unity", "Solidity", "IPFS"], demo_url: "https://nexusworld.demo.com",
    github_url: "https://github.com/meta-builders/nexus", pitch_deck_url: "", video_url: "",
    track: "Gaming & Metaverse", status: "submitted", is_draft: false,
    scores: [{ judge_name: "Judge A", innovation: 8, technical: 7, impact: 9, presentation: 9, total: 33, comments: "Great UX" }],
    average_score: 33,
  },
];

export const announcements = [
  { id: "a1", hackathon_id: "1", title: "Mentor Sessions Now Live!", message: "Book 1-on-1 sessions with our mentors through the Discord server.", priority: "info", author: "Organizer", created_date: "2025-07-02T10:00:00" },
  { id: "a2", hackathon_id: "1", title: "Submission Deadline Reminder", message: "Only 3 days left to submit! Make sure your project is submitted before July 14 11:59 PM UTC.", priority: "warning", author: "Organizer", created_date: "2025-07-11T09:00:00" },
  { id: "a3", hackathon_id: "1", title: "API Rate Limits Updated", message: "We've increased Infura and Alchemy rate limits for all participants.", priority: "info", author: "Organizer", created_date: "2025-07-05T14:30:00" },
];

// Helper to generate next ID
let nextId = 100;
export function generateId() { return String(++nextId); }
