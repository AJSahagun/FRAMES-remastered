import { Poppins,Noto_Sans, Aldrich, Lora } from 'next/font/google'

export const poppins = Poppins({
    weight: ['400' ,'500', '600'],
    subsets: ['latin'],
});

export const noto_sans = Noto_Sans({
    weight: ['300' ,'400', '500', '600'],
    subsets: ['latin'],
})

export const aldrich = Aldrich({
    weight: '400',
    subsets: ['latin'],
});

export const lora = Lora({
    weight: ['400'],
    subsets: ['latin'],
});