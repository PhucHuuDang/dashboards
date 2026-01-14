import Image from "next/image";
import Link, { LinkProps } from "next/link";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  FolderIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { HandWrittenTitle } from "@/components/ui/hand-writing-text";
import { Prettify } from "@/types";

enum EmptyStateType {
  NOT_FOUND = "not-found",
  NO_PROJECTS = "no-projects",
}

interface NotfoundProps extends Prettify<
  React.ComponentProps<"div"> & Omit<LinkProps, "href">
> {
  src: string;
  alt: string;
  width: number;
  height: number;

  description?: string;

  href?: string;
  type: EmptyStateType;
}

export default function Notfound({ type, ...props }: NotfoundProps) {
  let background;

  switch (type) {
    case EmptyStateType.NOT_FOUND:
      background = (
        <NotFoundImageBackground
          {...props}
          src="/nature-image.jpg"
          alt="Not Found"
          width={1000}
          height={1000}
          href="/dashboard"
        />
      );
      break;
    case EmptyStateType.NO_PROJECTS:
      background = (
        <EmptyState
          {...props}
          src="/nature-image.jpg"
          alt="No Projects Yet"
          width={1000}
          height={1000}
          href="/dashboard"
        />
      );
      break;
    default:
      background = (
        <NotFoundImageBackground
          src="/nature-image.jpg"
          alt="Not Found"
          width={1000}
          height={1000}
          href="/dashboard"
        />
      );
      break;
  }

  return <div className="w-full h-screen">{background}</div>;
}

const NotFoundImageBackground = ({
  src,
  alt,
  width,
  height,
  href = "/dashboard",
  description = "The page you are looking for does not exist.",
  ...props
}: Omit<NotfoundProps, "type">) => {
  const { className = "", ...rest } = props;
  return (
    <div className="w-full h-full bg-background relative overflow-hidden">
      <Image
        src={src}
        alt="Not Found"
        // width={1000}
        // height={1000}
        className={cn("object-cover w-full h-full", className)}
        fill
        priority
        aria-description="Not Found Image Background"
        aria-label="Not Found Image Background"
        aria-labelledby="Not Found Image Background"
        aria-roledescription="Not Found Image Background"
        aria-describedby="Not Found Image Background"
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <HandWrittenTitle title="404" subtitle="Page Not Found" />
        <p className="text-md md:text-lg text-foreground">{description}</p>

        <Link href={href} className="mt-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex items-center gap-2 group/button:hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Go to Dashboard
            <ArrowUpRightIcon
              className="size-4 group-hover/button:-translate-y-0.5 
            group-hover/button:translate-x-0.5
            transition-all duration-300"
            />
          </Button>
        </Link>
      </div>
    </div>
  );
};

const EmptyState = ({
  src,
  alt,
  width,
  height,
  title = "No Projects Yet",
  // href = "/dashboard",
  href = "#",
  description = "The page you are looking for does not exist.",
  ...props
}: Omit<NotfoundProps, "type">) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Create Project</Button>
          <Button variant="outline">Import Project</Button>
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <Link href="#">
          Go to Dashboard{" "}
          <ArrowUpRightIcon
            className="size-4 group-hover/button:-translate-y-0.5 
          group-hover/button:translate-x-0.5
          transition-all duration-300"
          />
        </Link>
      </Button>
    </Empty>
  );
};
