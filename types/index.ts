import { LucideIcon, LucideProps } from "lucide-react";

import { AnimatedIconProps } from "@/components/ui/types";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type IconComponent =
  | React.ComponentType<LucideProps>
  | React.ComponentType<AnimatedIconProps>;

export type EmptyProps<T extends React.ElementType> = Omit<
  React.ComponentProps<T>,
  keyof React.ComponentProps<T>
>;

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}
