export type SquadCategory = 'GOALKEEPERS' | 'DEFENDERS' | 'MIDFIELDERS' | 'FORWARDS' | 'TECHNICAL';

export type SquadMember = {
  slug: string;
  name: string;
  number?: string;
  role: string;
  category: SquadCategory;
  nationality: string;
  image: string;
  appearances: string;
  bio: string;
};

export const squad: SquadMember[] = [
  { slug: 'liam-jacobs', name: 'Liam Jacobs', number: '01', role: 'GOALKEEPER', category: 'GOALKEEPERS', nationality: 'South Africa', image: '/images/kit-navy.jpg', appearances: '23', bio: 'A calm presence between the posts with sharp distribution and a relentless work ethic.' },
  { slug: 'bongani-cele', name: 'Bongani Cele', number: '04', role: 'DEFENDER', category: 'DEFENDERS', nationality: 'South Africa', image: '/images/kit-yellow.jpg', appearances: '21', bio: 'A composed defender who brings strength, timing and leadership to the back line.' },
  { slug: 'thabo-mokoena', name: 'Thabo Mokoena', number: '08', role: 'MIDFIELDER', category: 'MIDFIELDERS', nationality: 'South Africa', image: '/images/team-standing.jpg', appearances: '22', bio: 'A progressive midfielder who connects the press to the final third.' },
  { slug: 'siyanda-ndlovu', name: 'Siyanda Ndlovu', number: '11', role: 'FORWARD', category: 'FORWARDS', nationality: 'South Africa', image: '/images/team-home-away.jpg', appearances: '20', bio: 'A direct forward with pace, movement and an instinct for the decisive moment.' },
  { slug: 'musa-dlamini', name: 'Musa Dlamini', number: '06', role: 'MIDFIELDER', category: 'MIDFIELDERS', nationality: 'South Africa', image: '/images/kit-product.jpg', appearances: '18', bio: 'A versatile ball-carrier who gives United control in the centre of the pitch.' },
  { slug: 'andile-khumalo', name: 'Andile Khumalo', number: '17', role: 'FORWARD', category: 'FORWARDS', nationality: 'South Africa', image: '/images/kit-yellow.jpg', appearances: '16', bio: 'An energetic wide attacker who loves to take on defenders.' },
  { slug: 'jordan-naidoo', name: 'Jordan Naidoo', role: 'HEAD COACH', category: 'TECHNICAL', nationality: 'South Africa', image: '/images/summer-cup-2026.jpg', appearances: '2026', bio: 'The head coach guiding a new generation with brave football and clear purpose.' },
  { slug: 'nomsa-mthembu', name: 'Nomsa Mthembu', role: 'PERFORMANCE DIRECTOR', category: 'TECHNICAL', nationality: 'South Africa', image: '/images/team-home-away.jpg', appearances: '2026', bio: 'Leading the performance programme that keeps United ready for every matchday.' }
];
