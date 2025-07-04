import Link from "next/link";
import Image from "next/image";

export default function Card({
  favicon,
  url,
  name,
  description,
}: {
  favicon: string;
  url: string;
  name: string;
  description: string;
}) {
  return (
    <>
      <Link
        href={url}
        className="dark:bg-dark-800 flex items-center gap-2 rounded-lg bg-white px-4 py-3 pr-6 shadow-md transition-shadow duration-200 hover:translate-y-[-2px] hover:shadow-lg"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl bg-gray-200">
          <Image src={favicon} alt={"favicon"} width={16} height={16}></Image>
        </div>
        <div className="flex min-w-0 flex-1 flex-col text-sm">
          <h2 className="truncate font-semibold text-gray-900 dark:text-white">
            {name}
          </h2>
          <p className="truncate text-gray-600 dark:text-gray-300">
            {name + description}
          </p>
        </div>
      </Link>
    </>
  );
}
