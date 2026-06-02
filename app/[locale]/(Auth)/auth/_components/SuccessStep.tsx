import { IoCheckmark } from "react-icons/io5";

type Props = {
  title: string;
  description: string;
};

export default function SuccessStep({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-10 flex h-38 w-38 items-center justify-center">
        <div className="absolute h-26 w-26 rounded-full bg-[#26B37A]" />
        <div className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#111827]">
          <IoCheckmark size={34} />
        </div>
        <span className="absolute left-2 top-7 h-3 w-3 rotate-12 border-l-4 border-b-4 border-[#0B72FF]" />
        <span className="absolute right-4 top-6 text-xl text-[#FFB339]">*</span>
        <span className="absolute right-2 top-15 text-3xl text-[#00B26F]">*</span>
        <span className="absolute left-6 top-18 h-1 w-6 rounded-full bg-[#00B26F]" />
        <span className="absolute left-8 bottom-12 text-3xl text-[#0B72FF]">~</span>
        <span className="absolute right-5 bottom-10 text-3xl text-[#0B72FF]">~</span>
        <span className="absolute right-3 bottom-18 h-3 w-3 rounded-full bg-[#374151]" />
        <span className="absolute right-10 bottom-10 h-1.5 w-1.5 rounded-full bg-[#4B5563]" />
        <span className="absolute top-3 h-4 w-4 rounded-full border-4 border-[#FFB339] border-r-transparent border-t-transparent" />
      </div>
      <p className="mx-auto max-w-[14ch] text-center text-3xl font-semibold leading-[125%] tracking-[0.12px] text-white sm:text-5xl">
        {title}
      </p>
      <p className="mt-4 text-center text-base text-[#C9CDD4]">{description}</p>
    </div>
  );
}
