import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import type { TopNavItem as TopNavItemType } from "./TopNav";

export const TopNavItem = ({
  item,
  isAdmin,
  setIsOpen,
}: {
  item: TopNavItemType;
  isAdmin: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const navigate = useNavigate();

  if (item?.onlyAdmin && !isAdmin) return null;
  return (
    <div
      onClick={() => {
        setIsOpen(false);
        navigate(item.href);
      }}
      className="flex items-center gap-2 p-3 bg-neutral-900 rounded-2xl relative overflow-hidden w-full"
    >
      {item?.icon && <FontAwesomeIcon icon={item.icon} />}
      {item?.icon && (
        <FontAwesomeIcon
          icon={item?.icon}
          className="text-6xl opacity-5 absolute -top-1 -right-1 -rotate-12"
        />
      )}
      <div>
        <p className="font-cool text-base">{item?.label}</p>
        {item?.descripcion && <p>{item?.descripcion}</p>}
      </div>
    </div>
  );
};
