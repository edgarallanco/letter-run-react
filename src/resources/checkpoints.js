const checkpoint = [
  {
    origin: 'E1',
    url: 'https://uselessfacts.jsph.pl/random.json',  
    item_name: 'Laptop',
    img_url: 'https://fargamot.s3.amazonaws.com/images/objects_01.png',
    number: 0,
    position: laptopCoords,
    size: [2, 2, 2],
    stair: '1_E_Stairs',
    collected: false,
    object: '1_E_Object',
    item_id: 'laptop',
    item_headline: 'Take Note: You Found It!',
    item_body_copy: 'The EA Team has all kinds of learners - auditory, kinesthetic, visual - but the readers and writers here collect wobbly towers of EA blue notebooks full of scribbles in their home offices.',
  },
  {
    origin: 'D1',
    url: 'https://uselessfacts.jsph.pl/random.json',
    item_name: 'EA Socks',
    img_url: 'https://fargamot.s3.amazonaws.com/images/objects_02.png',
    number: 1,
    position: socksCoords,
    size: [1.5, 4, 1.5],
    stair: '2_D_Stairs',
    collected: false,
    object: '2_D_Object',
    item_id: 'sock',
    item_headline: 'Ok, Where Can I Get a Pair of Those?',
    item_body_copy: 'Our iconic Edgar-emblazoned socks are the hottest piece of schwag we\'ve ever had.'
    ,
  },
  {
    origin: 'G1',
    url: 'https://uselessfacts.jsph.pl/random.json',
    item_name: 'Soccer Ball',
    img_url: 'https://fargamot.s3.amazonaws.com/images/objects_03.png',
    number: 2,
    position: soccerCoords,
    size: [1.5, 4, 1.5],
    stair: '3_G_Stairs',
    collected: false,
    object: '3_G_Object',
    item_id: 'soccerBall',
    item_headline: '¡Vamos al juego!',
    item_body_copy: 'Pre-pandemic, the US-based EA crew was obvs Team USA World Cup crazy, but since we\'ve gone global...let\'s goooooo Serbia and Argentina as well! Sorry Peru and South Africa!'
  },
  {
    origin: 'A1',
    url: 'https://uselessfacts.jsph.pl/random.json',
    item_name: 'World Map',
    img_url: 'https://fargamot.s3.amazonaws.com/images/objects_04.png',
    number: 3,
    position: globeCoords,
    size: [2, 4, 3],
    stair: '4_A_Stairs',
    collected: false,
    object: '4_A_Object',
    item_id: 'globe',
    item_headline: 'Like Moths to a Flame - You Made It',
    item_body_copy: 'Between October and end of April, EA\'s first office was made toasty and homey by a wood-burning stove. It was Mason\'s pride and joy, so we had to give it a nod here.'
  },
  {
    origin: 'R1',
    url: 'https://uselessfacts.jsph.pl/random.json',
    item_name: 'Vinyl',
    img_url: 'https://fargamot.s3.amazonaws.com/images/objects_05.png',
    number: 4,
    position: recordCoords,
    size: [2, 2, 2],
    stair: '5_R_Stairs',
    collected: false,
    object: '5_R_Object',
    item_id: 'record',
    item_headline: 'The Club Is Open. Welcome!',
    item_body_copy: 'We think of brand as a club you join rather than a foundation you build at EA. In that spirit, if your brand was a literal club, what records would you spin there? '
  },
  {
    origin: 'A2',
    url: 'https://uselessfacts.jsph.pl/random.json',
    item_name: 'EA mug',
    img_url: 'https://fargamot.s3.amazonaws.com/images/objects_06.png',
    number: 5,
    position: mugCoords,
    size: [2, 3, 2],
    stair: '6_A_Stairs',
    collected: false,
    object: '6_A_Object',
    item_id: 'mug',
    item_headline: 'You Found Our Favorite Beverage!',
    item_body_copy: 'Whether it\'s coffee, tea, or maté we are in love with pouring it into an insulated EA camp mug every morning or afternoon.'
  },
  {
    origin: 'L1',
    url: 'https://uselessfacts.jsph.pl/random.json',
    item_name: 'Spaceship',
    img_url: 'https://fargamot.s3.amazonaws.com/images/objects_07.png',
    number: 6,
    position: rocketCoords,
    size: [2, 2, 2],
    stair: '7_L_Stairs',
    collected: false,
    object: '7_L_Object',
    item_id: 'rocket',
    item_headline: 'Time for Launch! Let\'s Go!',
    item_body_copy: 'There\'s nothing more exciting that pushing a project out into the world. Rocket ship exciting? Depends on the project...'
    ,
  },
  {
    origin: 'L2',
    url: 'https://uselessfacts.jsph.pl/random.json',
    item_name: 'Frame',
    img_url: 'https://fargamot.s3.amazonaws.com/images/objects_08.png',
    number: 7,
    position: frameCoords,
    size: [1.5, 3, 3],
    stair: '8_L_Stairs',
    collected: false,
    object: '8_L_Object',
    item_id: 'board',
    item_headline: 'Nobody goes to the gallery to see the frames.',
    item_body_copy: 'That\'s our philosophy on content in a nutshell: Once building sites got easier, content quality got even more important, and became a huge focus for EA.'
  },
  {
    origin: 'A3',
    url: 'https://uselessfacts.jsph.pl/random.json',
    item_name: 'Kitty',
    img_url: 'https://fargamot.s3.amazonaws.com/images/objects_09.png',
    number: 8,
    position: bunnyCoords,
    size: [2.5, 3, 2.5],
    stair: '9_A_Stairs',
    collected: false,
    object: '9_A_Object',
    item_id: 'rabbit',
    item_headline: 'Hoppy Accidents Happen',
    item_body_copy: 'EA\'s pet family is mostly dogs and cats, but two team members have bunny friends to snuggle between meetings: Leo and Velvet live with Mason, and Nicholas keeps Katrina busy in Wisconsin.'
  },
  {
    origin: 'N1',
    url: 'https://uselessfacts.jsph.pl/random.json',
    item_name: 'Beach Ball',
    img_url: 'https://fargamot.s3.amazonaws.com/images/objects_10.png',
    number: 9,
    position: beachCoords,
    size: [2, 2, 3],
    stair: '10_N_Stairs',
    collected: false,
    object: '10_N_Object',
    item_id: 'beachBall',
    item_headline: 'Everybody in the Pool!',
    item_body_copy: 'Our Director of Design, Chesley\'s concept, we treat collaboration like a big, figma-focused pool party where designers, writers, UX, developers and even clients get in the work together and contribute collectively.'
  },
];

export default checkpoint;
