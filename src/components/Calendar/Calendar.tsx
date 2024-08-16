import { Schedule } from "@/types/Schedule";

const lanes = [
  {
    title: "Monday",
  },
  {
    title: "Tuesday",
  },
  {
    title: "Wednesday",
  },
  {
    title: "Thursday",
  },
  {
    title: "Friday",
  },
  {
    title: "Saturday",
  },
  {
    title: "Sunday",
  },
];

const TITLE_HEIGHT = "h-[5rem]";
const TIMESLOT_HEIGHT = "h-[6rem]";
const LANE_HEIGHT = "h-[145.5rem]"; // must equal TIMESLOT_HEIGHT * 24 + 1.5 (this 1.5 used to adjust space of lane below the display text '24:00')

type Props = {
  data: Schedule[];
};

export default function Calendar({ data }: Props) {
  return (
    <div className="w-[1000px] flex flex-row space-x-[2px] px-2 rounded-lg bg-emerald-400">
      <div className="basis-full flex flex-col items-end pr-2 pb-2">
        <div className={`${TITLE_HEIGHT}`}></div>
        {Array.from(Array(24).keys()).map((el) => (
          <div key={`timeslot-${el}`} className={`${TIMESLOT_HEIGHT}`}>
            {`${el.toString().padStart(2, "0")}`}:00
          </div>
        ))}
        <div>24:00</div>
      </div>
      {lanes.map((el) => (
        <div key={`cal-lane-${el.title}`} className="basis-full">
          {/* <Lane title={el.title} active={el.title === 'Monday' ? false : true} /> */}
          <Lane title={el.title} active={true} />
        </div>
      ))}
    </div>
  );
}

type LaneProps = {
  title: string;
  active: boolean;
};

function Lane({ title, active }: LaneProps) {
  return (
    <div className="flex flex-col">
      <div className="h-20 text-lg flex items-center justify-center">
        {title}
      </div>
      <div
        className={`${LANE_HEIGHT} w-full ${active ? "bg-white" : "bg-gray-300"}`}
      ></div>
    </div>
  );
}
