import { udata } from "@/data/udata";
import Card, { CardProps } from "@/components/Card";

export default async function Hidden() {
  const all: CardProps[] = []; // for seo
  for (const item of udata) {
    const all_chs = item.children.map((ch) => {
      return {
        name: ch.title,
        description: ch.description,
        url: ch.url,
        favicon: ch.favicon ?? null,
      };
    });

    all.push(...all_chs);
  }

  return (
    <div className="hidden">
      {all.map((item, index) => (
        <Card
          key={index}
          favicon={item.favicon}
          url={item.url}
          name={item.name}
          description={item.description}
        ></Card>
      ))}
    </div>
  );
}
