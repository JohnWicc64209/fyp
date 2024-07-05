export default function Navbar() {
  return (
    <div className=" flex justify-between items-center w-full px-5 sm:px-40 lg:px-[250px] pt-8">
      <div className=" text-3xl flex items-center">
        <div className=" font-bold flex items-center pr-[2px] mr-[-2px] justify-end rounded-full bg-[#f5bdeb] w-[50px] h-[50px]">
          <span>V</span>
        </div>
        <span>SS</span>
      </div>
      <div className=" text-sm flex gap-16">
        <span className="cursor-pointer">About</span>
        <span className="cursor-pointer">Support</span>
        <span className="cursor-pointer">FAQ</span>
      </div>
    </div>
  );
}
