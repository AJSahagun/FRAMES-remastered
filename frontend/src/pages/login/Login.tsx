import LoginForm from './form';

// interface LoginProps {
// 	username: string;
// 	password: string;
// };


export default function LoginPage() {

	return(
		<div className="flex flex-row ">
			{/* left */}
			<div className="w-7/12  border-green-700 max-h-dvh">
				{/* logo */}
				<div className="w-1/5 mt-8 ml-16">
					<img src="logos\FRAMES_title-logo.png" alt="FRAMES logo"/>
				</div>

				<div className="flex">
					{/* rounded rectangle */}
					<div className="rounded-[6em] bg-gradient-to-br from-tc to-btnBg
					lg:h-[32em] lg:w-[32em] mt-8 ml-36"> 
					</div>
					{/* image */}
					<div className="absolute w-[48em] mt-28 ml-36">
						<img src="\images\3d-books-nobg.png" alt="3D Books.png" />
					</div>
				</div>

			</div>

			{/* right */}
			<div className="flex flex-col w-2/5  border-orange-700 h-dvh justify-center font-poppins ml-10">
				<div className="font-semibold -space-y-2">
					<h2 className="text-[2.5rem] text-tc">HELLO,</h2>
					<h2 className="text-[2.5rem] text-tc">WELCOME BACK</h2>
				</div>
				
				<div className="relative items-start justify-start">
					<p className="text-tc text-left text-[0.9rem] mt-16 mb-3">Please sign in to continue</p>
				</div>

				<div>
					<LoginForm/>
				</div>



			</div>
		</div>
	);
};