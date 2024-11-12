export const departmentOptions = [
    { value: "CAFAD", label: "College of Architecture, Fine Arts & Design" },
    { value: "CET", label: "College of Engineering Technology" },
    { value: "CICS", label: "College of Informatics and Computing Sciences" },
    { value: "COE", label: "College of Engineering" },
  ];
  
export const programOptions: Record<string, { value: string; label: string }[]> = {
    CAFAD: [
      { value: "BSArchi", label: "BS Architecture" },
      { value: "BFA", label: "Bachelor of Fine Arts" },
      { value: "BSID", label: "BS Interior Design" },
    ],
    
    // TODO: need to clarify the new names
    CET: [
      { value: "BAutoEngTech", label: "Bachelor of Automotive Engineering Technology" },
      { value: "BCompEngTech", label: "Bachelor of Computer Engineering Technology" },
      { value: "BCivEngTech", label: "Bachelor of Civil Engineering Technology" },
    ],
    CICS: [
      { value: "BSCS", label: "BS Computer Science" },
      { value: "BSIT", label: "BS Information Technology" },
    ],
    COE: [
            { value: "BSAeE", label: "BS Aerospace Engineering" },
      { value: "BSAE", label: "BS Automotive Engineering" },
      { value: "BSBioE", label: "BS Biomedical Engineering" },
      { value: "BSCE", label: "BS Civil Engineering" },
      { value: "BSCerE", label: "BS Ceramics Engineering" },
      { value: "BSChE", label: "BS Chemical Engineering" },
      { value: "BSCoE", label: "BS Computer Engineering" },
      { value: "BSEE", label: "BS Electrical Engineering" },
      { value: "BSECE", label: "BS Electronics Engineering" },
      { value: "BSFE", label: "BS Food Engineering" },
      { value: "BSIE", label: "BS Industrial Engineering" },
      { value: "BSICE", label: "BS Instrumentation & Control Engineering" },
      { value: "BSME", label: "BS Mechanical Engineering" },
      { value: "BSMexE", label: "BS Mechatronics Engineering" },
      {value: "BSNAME", label: "BS Naval Architecture and Marine Engineering"},
      { value: "BSPetE", label: "BS Petroleum Engineering" },
      { value: "BSSE", label: "BS Sanitary Engineering" },
      { value: "BSTE", label: "BS Transportation Engineering" },
      { value: "BSGE", label: "BS Geodetic Engineering" },
      { value: "BSGeoE", label: "BS Geological Engineering" },
      { value: "BSMetE", label: "BS Metallurgical Engineering" },
      { value: "MSAI", label: "Master of Science in Artificial Intelligence" },
      { value: "MSAM", label: "Master of Science in Advanced Manufacturing" },
      { value: "MSCE", label: "Master of Science in Computer Engineering" },
      { value: "MSCM", label: "Master of Science in Construction Management" },
      { value: "MSDS", label: "Master of Science in Data Science" },
      { value: "MSEaE", label: "Master of Science in Earthquake Engineering" },
      { value: "MSECE", label: "Master of Science in Electronics Engineering" },
      { value: "MSEgyE", label: "Master of Science in Energy Engineering" },
      { value: "MSEM", label: "Master of Science in Engineering Management" },
      { value: "MEng", label: "Master of Engineering" },
      { value: "MSTE", label: "Master of Science in Transportation Engineering" },
      { value: "MSMSE", label: "Master of Science in Material Science and Engineering" },
      { value: "MUPD", label: "Master in Urban Planning and Design" },
      { value: "PhDEE", label: "Doctor of Philosophy in Electronics Engineering" },
      { value: "PhDEM", label: "Doctor of Philosophy in Engineering Management" },
      { value: "PhDEE", label: "Doctor of Philosophy in Engineering Education" }
    ],
  };

  