"use client";

import { createTheme } from "@mantine/core";

export const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    sizes: {
      // Define your custom title styles
      h1: { // Title/Large
        fontWeight: "600",
        fontSize: '32px',
        lineHeight: '40px',
      },
      h2: { // Title/Medium
        fontWeight: "600",
        fontSize: '20px',
        lineHeight: '32px',
      },
      h3: { // Title/Small
        fontWeight: "600",
        fontSize: '16px',
        lineHeight: '24px',
      },
      h4: { // Title/xs
        fontWeight: "600",
        fontSize: '14px',
        lineHeight: '16px',
      },
      h5: { // Title/xss
        fontWeight: "600",
        fontSize: '12px',
        lineHeight: '16px',
      },
    },
  },
  // Add custom text styles
  other: {
    textBoldSmall: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0px',
    },
    textBoldXs: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0%',
    },
    textBoldXss: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '14px',
      letterSpacing: '0%',
    },
    textSmall: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0%',
    },
    textXs: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0%',
    },
    textXss: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '14px',
      letterSpacing: '0%',
    },
  },
  // Add custom colors
  colors: {
    // Define custom colors with shades (Mantine requires an array of 10 shades)
    dye: [
      '#DCEAFF', // lightest shade (for hover states, etc.)
      '#BBD3F8',
      '#97AFD6',
      '#768EB4',
      '#586E92',
      '#3E5170',
      '#27364E',
      '#27364E',
      '#27364E',
      '#27364E', // original dye color (index 9)
    ],
    blue: [
      '#E7F1FF', // lightest shade
      '#B3D1FF',
      '#7EB2FF',
      '#4992FF',
      '#146EF5',
      '#004EC2',
      '#00398F',
      '#00255C',
      '#146EF5',
      '#146EF5', // original blue color (index 9)
    ],
    grey: [
      '#FFFFFF', // lightest shade
      '#F0F0F0',
      '#BCBCBC',
      '#A3A3A3',
      '#898989',
      '#707070',
      '#575555',
      '#989898',
      '#8C8C8C',
      '#707070', // original grey color (index 9)
    ],
    red: [
      '#FFE5E7', // lightest shade
      '#FFACB2',
      '#FF737D',
      '#FF3948',
      '#FF9BA0',
      '#E70011',
      '#B4000D',
      '#81000A',
      '#4E0006',
      '#E70011', // original red color (index 9)
    ],
    green: [
      '#EEFFF6', // lightest shade
      '#BDFFDB',
      '#8CFFC1',
      '#40D886',
      '#29AF67',
      '#17864B',
      '#0B5E31',
      '#6FD79F',
      '#5DD293',
      '#40D886', // original green color (index 9)
    ]
  },
});
