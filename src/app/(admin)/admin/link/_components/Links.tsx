import { LinkWithCountAndUser } from "@/types/entityRelations";
import LinkFigure from "./LinkFigure";

export default function Links({ links }: { links: LinkWithCountAndUser[] }) {
  return (
    <div className="flex flex-col gap-3">
      {links.map((link: LinkWithCountAndUser) => (
        <LinkFigure link={link} key={link.slug}></LinkFigure>
      ))}
    </div>
  );
}
