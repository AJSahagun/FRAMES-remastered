export default function FosterWeelerTag() {
  return (
    <div className="hidden lg:flex w-2/6 absolute top-6 right-0 mt-8 ml-10">
      <div className="flex w-full">
        <div className="flex w-full h-10 pr-1 bg-primary py-6 justify-center items-center  text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] lg:py-7">
          <p className="text-lg font-noto_sans md:text-base align-middle tracking-wide lg:text-md">
            Foster Wheeler Library - Alangilan
          </p>
        </div>
        <div className="">
          <img className="absolute w-24 -left-5 -top-4 lg:w-24" src="/logos/batstateu-logo.png" alt="Logo" />

        </div>
      </div>
    </div>
  );
}