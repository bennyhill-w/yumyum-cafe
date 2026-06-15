export const PLACEHOLDER_MENU = [
  {
    id: "jollof-rice-chicken",
    name: "Jollof Rice & Chicken",
    description:
      "Classic party-style jollof rice served with a juicy grilled chicken piece. Cooked with fresh tomatoes, peppers, and aromatic spices.",
    price: 3500,
    originalPrice: 4000,
    onSale: true,
    saleEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    allergens: ["Gluten", "Soy"],
    category: "rice-dishes",
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80",
    popular: true,
    available: true,
    extras: ["Extra chicken +₦500", "Extra rice +₦300", "Coleslaw +₦200"],
  },
  {
    id: "fried-rice-beef",
    name: "Fried Rice & Beef",
    description:
      "Flavourful Nigerian fried rice with seasoned beef, mixed vegetables, and a rich soy-based seasoning.",
    price: 3200,
    allergens: ["Soy", "Eggs"],
    category: "rice-dishes",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
    popular: false,
    available: true,
    extras: ["Extra beef +₦500", "Extra rice +₦300"],
  },
  {
    id: "white-rice-stew",
    name: "White Rice & Stew",
    description:
      "Steamed white rice served with rich tomato stew and your choice of protein. A Nigerian comfort food classic.",
    price: 2800,
    allergens: [],
    category: "rice-dishes",
    image:
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&q=80",
    popular: false,
    available: true,
    extras: ["Chicken +₦500", "Beef +₦400", "Fish +₦600"],
  },
  {
    id: "grilled-chicken",
    name: "Grilled Chicken",
    description:
      "Whole chicken leg marinated in our signature spice blend and flame-grilled to perfection. Juicy inside, crispy outside.",
    price: 2500,
    originalPrice: 2800,
    onSale: true,
    saleEndsAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    allergens: ["Soy"],
    category: "chicken",
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80",
    popular: true,
    available: true,
    extras: ["Extra piece +₦1,200", "Spicy sauce +₦100"],
  },
  {
    id: "fried-chicken",
    name: "Fried Chicken",
    description:
      "Crispy golden fried chicken with our house seasoning. Crunchy on the outside, tender and juicy on the inside.",
    price: 2200,
    allergens: ["Gluten", "Eggs"],
    category: "chicken",
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80",
    popular: true,
    available: true,
    extras: ["Extra piece +₦1,000", "Dipping sauce +₦100"],
  },
  {
    id: "peppered-chicken",
    name: "Peppered Chicken",
    description:
      "Tender chicken pieces in a rich, spicy Nigerian pepper sauce. Bold flavours, made fresh daily.",
    price: 2800,
    allergens: ["Soy", "Sesame"],
    category: "chicken",
    image:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&q=80",
    popular: false,
    available: true,
    extras: ["Extra sauce +₦150"],
  },
  {
    id: "chicken-pie",
    name: "Chicken Pie",
    description:
      "Flaky golden pastry filled with seasoned minced chicken and vegetables. Our bestselling snack — freshly baked every morning.",
    price: 1200,
    allergens: ["Gluten", "Dairy", "Eggs"],
    category: "snacks",
    image:
      "https://images.unsplash.com/photo-1604908177520-c552105b0c63?w=600&q=80",
    popular: true,
    available: true,
    extras: [],
  },
  {
    id: "beef-roll",
    name: "Beef Roll",
    description:
      "Crispy pastry roll filled with spiced minced beef. Perfect as a snack or starter.",
    price: 1000,
    allergens: ["Gluten"],
    category: "snacks",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
    popular: false,
    available: true,
    extras: [],
  },
  {
    id: "puff-puff",
    name: "Puff Puff (6 pcs)",
    description:
      "Soft, sweet deep-fried dough balls — a Nigerian street food classic. Light, fluffy, and perfectly golden.",
    price: 800,
    category: "snacks",
    image:
      "https://images.unsplash.com/photo-1609167830220-7164aa360951?w=600&q=80",
    popular: false,
    available: true,
    extras: ["Extra 6 pcs +₦700"],
  },
  {
    id: "coleslaw",
    name: "Coleslaw",
    description:
      "Fresh, creamy coleslaw with a light dressing. The perfect side for any meal.",
    price: 600,
    category: "sides",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    popular: false,
    available: true,
    extras: [],
  },
  {
    id: "plantain",
    name: "Fried Plantain",
    description:
      "Sweet ripe plantain, fried golden and caramelised on the outside. A Lagos favourite.",
    price: 700,
    category: "sides",
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e562?w=600&q=80",
    popular: true,
    available: true,
    extras: [],
  },
  {
    id: "moi-moi",
    name: "Moi Moi",
    description:
      "Steamed bean pudding with egg and fish — a classic Nigerian staple. Soft, savoury, and filling.",
    price: 800,
    category: "sides",
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80",
    popular: false,
    available: true,
    extras: [],
  },
  {
    id: "chapman",
    name: "Chapman",
    description:
      "Nigeria's favourite chilled party drink. A fruity blend of juices, grenadine, and garnishes — refreshing and vibrant.",
    price: 1000,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80",
    popular: true,
    available: true,
    extras: ["Large cup +₦400"],
  },
  {
    id: "zobo",
    name: "Zobo Drink",
    description:
      "Refreshing chilled hibiscus drink with ginger, cloves, and pineapple. A Nigerian herbal classic.",
    price: 700,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
    popular: false,
    available: true,
    extras: [],
  },
  {
    id: "soft-drink",
    name: "Soft Drink (Can)",
    description:
      "Choice of Coke, Fanta, Sprite or Pepsi — served chilled. The perfect companion to your meal.",
    price: 500,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",
    popular: false,
    available: true,
    extras: ["Coke", "Fanta", "Sprite", "Pepsi"],
  },
  {
    id: "ice-cream",
    name: "Ice Cream (2 scoops)",
    description:
      "Creamy soft-serve ice cream — vanilla, chocolate, or strawberry. A cool, sweet finish to your meal.",
    price: 1000,
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80",
    popular: true,
    available: true,
    extras: ["Extra scoop +₦300", "Cone upgrade +₦200"],
  },
  {
    id: "chin-chin",
    name: "Chin Chin",
    description:
      "Crunchy fried Nigerian snack — sweet, perfectly seasoned, and totally addictive.",
    price: 600,
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=600&q=80",
    popular: false,
    available: true,
    extras: [],
  },
  {
    id: "meat-pie",
    name: "Meat Pie",
    description:
      "Freshly baked flaky pastry filled with minced meat, potatoes and carrots. Straight from our in-house bakery.",
    price: 1000,
    category: "bakery",
    image:
      "https://images.unsplash.com/photo-1604908177520-c552105b0c63?w=600&q=80",
    popular: true,
    available: true,
    extras: [],
  },
  {
    id: "sausage-roll",
    name: "Sausage Roll",
    description:
      "Crispy golden puff pastry wrapped around a seasoned sausage filling. Baked fresh daily in our bakery.",
    price: 800,
    category: "bakery",
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
    popular: false,
    available: true,
    extras: [],
  },
  {
    id: "butter-bread",
    name: "Butter Bread (loaf)",
    description:
      "Soft, freshly baked white bread with a rich buttery flavour. Baked in our bakery every morning.",
    price: 1500,
    category: "bakery",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    popular: false,
    available: true,
    extras: ["Sliced +₦100"],
  },
  {
    id: "doughnut",
    name: "Doughnuts (2 pcs)",
    description:
      "Soft, pillowy doughnuts glazed with sugar icing. Made fresh from our bakery.",
    price: 900,
    category: "bakery",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
    popular: true,
    available: true,
    extras: ["Chocolate glazed", "Sugar glazed", "Strawberry glazed"],
  },
  {
    id: "ice-cream-cup",
    name: "Ice Cream Cup",
    description:
      "Creamy hand-scooped ice cream served in a cup or cone. Choose from vanilla, chocolate, or strawberry.",
    price: 800,
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&q=80",
    popular: true,
    available: true,
    extras: ["Vanilla", "Chocolate", "Strawberry", "Mixed +₦200"],
  },
  {
    id: "ice-cream-sundae",
    name: "Ice Cream Sundae",
    description:
      "Generous scoops of ice cream topped with syrup, wafers, and sprinkles. A showstopper dessert.",
    price: 1500,
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80",
    popular: false,
    available: true,
    extras: ["Chocolate syrup", "Strawberry syrup", "Caramel syrup"],
  },
];

export const PLACEHOLDER_TESTIMONIALS = [
  {
    name: "Aisha Bello",
    location: "Ikeja",
    text: "Delicious food and fast service — the jollof rice is my favourite! Always fresh and tasty.",
  },
  {
    name: "Chinedu Okoro",
    location: "Surulere",
    text: "Great flavours and friendly staff. I order weekly and it never disappoints.",
  },
  {
    name: "Ngozi Eze",
    location: "Lekki",
    text: "Loved the grilled chicken — juicy and perfectly spiced. Highly recommended!",
  },
  {
    name: "Tunde Williams",
    location: "Yaba",
    text: "Quick pickup and excellent portion sizes. The team always gets my order right.",
  },
];
