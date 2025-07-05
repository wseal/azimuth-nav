import Link from "next/link";
import Image from "next/image";

export interface CardProps {
  name: string;
  description: string;
  url: string;
  favicon: string | null;
}

export default async function Card({
  favicon,
  url,
  name,
  description,
}: CardProps) {
  return (
    <>
      <Link
        href={url}
        target="_blank"
        className="dark:bg-dark-800 hover:bg-dark-100 dark:hover:bg-dark-800 flex items-center gap-2 rounded-lg border border-white bg-white px-4 py-3 pr-6 shadow-md transition-shadow duration-200 hover:border-gray-400 hover:shadow-md dark:border-gray-800"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl bg-gray-200 dark:bg-gray-300">
          <Image
            src={
              favicon && favicon?.length > 0
                ? favicon
                : "https://github.githubassets.com/favicons/favicon.svg"
            }
            alt={"favicon"}
            width={16}
            height={16}
          ></Image>
        </div>
        <div className="flex min-w-0 flex-1 flex-col text-sm">
          <h2 className="truncate font-semibold text-gray-900 dark:text-gray-200">
            {name}
          </h2>
          <p className="truncate text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </Link>
    </>
  );
}
