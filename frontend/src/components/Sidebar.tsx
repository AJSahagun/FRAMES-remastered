export default function Sidebar() {
  return (
    <div className="h-dvh w-1/3 md:w-1/4 lg:w-1/5 xl:w-2.5/12 bg-gradient-to-b from-tc to-btnBg">
      <div className="flex justify-center mr-2 ">
        <img src="/logos/frames-square-white.png" alt="" className="w-4/5" />
      </div>

      <div className="space-y-1 font-poppins font-light text-xl ">
        <div className="mt-9 p-2 py-3 hover:bg-tcf text-background">
          <a href="/dashboard/">
            <h2 className="ml-12">Dashboard</h2>
          </a>
        </div>
        <div className="p-2 py-3 hover:bg-tcf text-background">
          <a href="/dashboard/visitor-history">
            <h2 className="ml-12">Visitor History</h2>
          </a>
        </div>
        <div className="p-2 py-3 hover:bg-tcf text-background">
          <a href="/access/in" target="_blank">
            <h2 className="ml-12">Access Check-in</h2>
          </a>
        </div>
        <div className="p-2 py-3 hover:bg-tcf text-background">
          <a href="/access/out" target="_blank">
            <h2 className="ml-12">Access Check-out</h2>
          </a>
        </div>
      </div>
    </div>
  );
}
