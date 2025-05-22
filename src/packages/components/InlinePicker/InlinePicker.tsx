import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { InlinePickerItem } from "./InlinePickerItem";


export type InlinePickerSize = 'sm' | 'md' | 'lg';

export interface InlinePickerProps {
  options: Array<{ id: number; label: string; icon?: IconDefinition }>;
  activeTabId?: number;
  onTabClick: (id: number) => void;
  size: InlinePickerSize;
  containerClassName?: string;
  itemContainerClassName?: string;
  iconClassName?: string;
  textClassName?: string;
}

export const InlinePicker = (props: InlinePickerProps) => {
  const {
    options,
    activeTabId,
    onTabClick,
    size,
    containerClassName = "",
    itemContainerClassName = "",
    iconClassName = "",
    textClassName = "",
  } = props;

  const [idSelected, setIdSelected] = useState(activeTabId || options[0].id);

  const handleSelectTab = (idNewTab: number) => {
    setIdSelected(idNewTab);
    onTabClick(idNewTab);
  };

  const activeIndex = options.findIndex((opcion) => opcion.id === idSelected);
  const tabWidth = 100 / options.length;

  return (
    <nav className="block w-full">
      <div
        className={cn(
          `mx-auto rounded-xl bg-neutral-900 p-1`,
          containerClassName
        )}
      >
        <ul className="relative flex flex-row justify-between">
          <li
            className="absolute h-full cursor-pointer rounded-lg bg-neutral-500/20 px-2 text-center transition-transform duration-300 ease-in-out"
            style={{
              width: `${tabWidth}%`,
              transform: `translateX(${activeIndex * 100}%)`,
            }}
          ></li>

          {options?.map((option) => (
            <InlinePickerItem
              key={option.id}
              id={option.id}
              label={option.label}
              onClick={handleSelectTab}
              active={idSelected === option.id}
              icon={option.icon}
              size={size}
              itemContainerClassName={itemContainerClassName}
              iconClassName={iconClassName}
              textClassName={textClassName}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
};