export default function RegisterFace() {
  const parameters = [
    "Well lit environment",
    "No other faces present",
    "Show full face",
    "Remove accessories",
    "Hold still"
  ];

	return(
		<div className="w-full flex flex-col items-center">
      <div className="text-center">
        <h1 className="text-tc font-poppins md:text-5xl lg:mt-2">Scan Face</h1>
      </div>

      <div className="container mx-auto p-4 
      md:mx-0 md:space-y-4 lg:flex-row lg:space-x-20 lg:w-screen lg:px-40 lg:mt-12">
        <div className="md:w-full md:flex md:flex-row-reverse md:items-start">
          <div className="md:w-1/2 mb-4 md:mb-0 md:ml-4">
            <div className="bg-gray-200 aspect-w-4 aspect-h-3 rounded-lg">
              {/* Webcam placeholder */}
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Webcam</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <ul className="space-y-2 justify-end">
              {parameters.map((param, index) => (
                <li key={index} className="flex items-center justify-end">
                  <h3 className="text-sm lg:text-lg font-noto_sans pr-1">
                    {param}
                  </h3>
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
	)
};
