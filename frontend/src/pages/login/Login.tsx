import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col h-dvh">
      {/* logo */}
      <div className="w-full items-baseline justify-normal xl:w-4/12 mt-8 xl:ml-16">
      <a href="/">
        <img
          src="logos\FRAMES_title-logo.png"
          alt="FRAMES logo"
          className="w-2/5"
        />
        </a>
      </div>

      <div className="w-full flex flex-row">
        {/* left */}
        <div className="w-full flex xl:w-1/2 xl:flex-row ">
          <div className="flex">
            {/* rounded rectangle */}
            <div
              className="flex w-64 h-64 rounded-[4em] xl:rounded-[6em] bg-gradient-to-br from-tc to-btnBg
						xl:h-[29em] xl:w-[29em] mt-10 ml-40"
            ></div>
            {/* image */}
            <div className="flex absolute w-80 xl:w-[43em] mt-32 ml-40">
              <img src="\images\3d-books-nobg.png" alt="3D Books.png" />
            </div>
          </div>
        </div>

        {/* right */}
        <div className="w-full flex flex-col xl:w-1/2 font-poppins xl:ml-10 justify-center">
          <div className="font-semibold flex flex-col xl:w-1/2 text-3xl xl:text-[2.5rem] text-tc mx-32">
            <h2 className="">HELLO,</h2>
            <h2 className="">WELCOME BACK</h2>
          </div>

          <div className="xl:flex xl:mx-32">
            <p className="text-tc opacity-80 text-sm xl:text-[0.9rem] mt-16 mb-3">
              Please sign in to continue
            </p>
          </div>

          <div className="w-10/12">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
