import { GiChickenLeg, GiRiceCooker, GiForkKnifeSpoon } from "react-icons/gi";
import { IoFlameSharp } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";
import { TbChefHat } from "react-icons/tb";

const items = [
  { icon: <IoFlameSharp size={14} />, text: "Freshly Made Daily" },
  { icon: <GiChickenLeg size={14} />, text: "Grilled Chicken" },
  { icon: <AiFillStar size={14} />, text: "4.8 Star Rated" },
  { icon: <GiRiceCooker size={14} />, text: "Jollof Rice" },
  { icon: <TbChefHat size={14} />, text: "Bakery" },
  { icon: <IoFlameSharp size={14} />, text: "4 Lagos Locations" },
  { icon: <GiForkKnifeSpoon size={14} />, text: "Continental & African" },
  { icon: <GiChickenLeg size={14} />, text: "Peppered Chicken" },
  { icon: <AiFillStar size={14} />, text: "Best Chicken Pie" },
  { icon: <GiRiceCooker size={14} />, text: "Fried Rice" },
  { icon: <TbChefHat size={14} />, text: "Ice Cream" },
  { icon: <IoFlameSharp size={14} />, text: "Order Online" },
];

export default function MarqueeStrip() {
  return (
    <div className="bg-brand-red overflow-hidden py-3.5 relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-brand-red to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-brand-red to-transparent z-10 pointer-events-none" />
      <div className="flex">
        <div className="flex animate-marquee whitespace-nowrap flex-shrink-0">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-white/90 text-sm font-bold px-6 font-sans"
            >
              <span className="text-yellow-300">{item.icon}</span>
              {item.text}
              <span className="text-white/30 mx-2">✦</span>
            </span>
          ))}
        </div>
        <div className="flex animate-marquee2 whitespace-nowrap flex-shrink-0">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-white/90 text-sm font-bold px-6 font-sans"
            >
              <span className="text-yellow-300">{item.icon}</span>
              {item.text}
              <span className="text-white/30 mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
