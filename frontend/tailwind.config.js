/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme:  {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        tc: "hsl(var(--textcolor))",
        sf: "hsla(var(--secondary-faded))",
        tcf: "hsla(var(--textcolor-faded))",
        ptcf: "hsla(var(--placeholder-tcf))",

        foreground: "hsl(var(--foreground))",
        btnBg: "hsl(var(--btn-bg))",
        btnHover: "hsla(var(--btn-hover))"

      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        noto_sans: ["Noto Sans", "sans-serif"],
        aldrich: ["Aldrich", "sans-serif"]
      }
    },
  },
  plugins: [],
}

