export default function LogoTeddy() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded bg-[#F26D21] relative">
        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#F26D21]/70"></div>
        <div className="absolute -top-1 left-3 w-2 h-2 rounded-full bg-[#F26D21]/70"></div>
        <div className="absolute top-3 -left-1 w-2 h-2 rounded-full bg-[#F26D21]/70"></div>
      </div>
      <span className="font-extrabold text-lg">teddy</span>
      <span className="text-[10px] -ml-1 mt-3 text-[#9B9B9B]">OPEN FINANCE</span>
    </div>
  )
}
