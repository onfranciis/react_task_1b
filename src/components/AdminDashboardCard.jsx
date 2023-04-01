import Image from "../CardDemo.png";
import Avatar from "../Avatar.png";
import UpArrow from "../UpArrow.png";
import { useDrag, useDrop } from "react-dnd";
import { NewData } from "./CardData";
import { useRef, useState } from "react";

const AdminDashboardCard = ({
  id,
  title,
  index,
  image,
  avatar,
  username,
  like,
  moveCard,
}) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: "Card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "Card",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const [rowBorderColor, setRowBorderColor] = useState(
    "rgba(255,255,255,0.12)"
  );
  const dragRowBorderColor = isDragging ? "" : rowBorderColor;

  return (
    <tr
      className=" border text-white tableRow"
      style={{ opacity }}
      ref={ref}
      data-handler-id={handlerId}
      // onMouseEnter={() => setRowBorderColor("green")}
      // onMouseDownCapture={() => setRowBorderColor("rgba(255,255,255,0.12)")}
      // onMouseUp={() => setRowBorderColor("rgba(255,255,255,0.12)")}
      // onMouseLeave={() => setRowBorderColor("rgba(255,255,255,0.12)")}
    >
      <td
        className={`border-[${dragRowBorderColor}] border-t  border-l border-b rounded-md rounded-r-none py-5`}
      >
        <div className="flex justify-start items-center gap-2">
          <p className="text-sm w-fit px-3">{id}</p>

          <div className=" flex items-center gap-2 ">
            <img
              src={avatar}
              alt={``}
              height={118}
              width={64}
              className="rounded"
            />
            <p className=" text-sm">{title}</p>
          </div>
        </div>
      </td>

      <td className={`border-[${dragRowBorderColor}]  border-t border-b`}>
        <div className=" flex justify-center items-center gap-1 px-5">
          <img
            src={avatar}
            alt=""
            height={24}
            width={24}
            className=" rounded-2xl"
          />
          <p className="text-sm text-[#DBFD51]">{username}</p>
        </div>
      </td>

      <td
        className={` border-[${dragRowBorderColor}] border-t border-r border-b rounded-md rounded-l-none`}
      >
        <div className=" flex justify-center items-center px-5">
          <p className="text-sm">{like}</p>
          <img src={UpArrow} alt="" height={20} width={20} />
        </div>
      </td>
    </tr>
  );
};

export default AdminDashboardCard;
