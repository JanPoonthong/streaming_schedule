
const lanes = [
  {
    title: "Monday"
  },
  {
    title: "Tuesday"
  },
  {
    title: "Wednesday"
  },
  {
    title: "Thursday"
  },
  {
    title: "Friday"
  },
  {
    title: "Saturday"
  },
  {
    title: "Sunday"
  }
]

export default function Calendar() {
  return <div className="w-[1000px] flex flex-row space-x-[1px] p-2 rounded-lg bg-blue-400">
    <div className="basis-full flex flex-col items-end">
      time
    </div>
    {
      lanes.map(el => (
        <div key={`cal-lane-${el.title}`} className="basis-full">
          <Lane title={el.title} />
        </div>
      ))
    }
  </div>;
}

type Props = {
  title: string;
};

function Lane({ title }: Props) {
  return <div className="bg-white h-[1200px] flex flex-col items-center " >
    <div className="text-lg pt-2">
      {title}
    </div>
  </div>;
}