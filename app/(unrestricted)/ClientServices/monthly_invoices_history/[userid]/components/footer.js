export default function PdFooter(user) {
  return [
    // Footer
    {
      text: "",
      margin: [0, 150, 0, 0],
    },
    {
      text: "Terms strictly apply.",
      style: "heading",
      margin: [0, 10, 0, 0],
    },
    {
      text: "All shipments by Direct Transport Solutions Pty Ltd and its agents are subject to our standard terms and conditions. Insurance liability has not been arranged or included unless specifically requested beforehand, along with the appropriate premium.",
      margin: [0, 10, 0, 0],
      style: "info_para",
    },

    // Direct Transport Solutions
    {
      text: "Direct Transport Solutions Pty Ltd ",
      style: "heading",
      margin: [0, 10, 0, 0],
    },
    {
      text: [
        "ABN 87 658 348 808",
        "| 1353 The Horsley Dr Wetherill Park NSW 2164 ",
        "| Phone: (02) 9030 0333",
        "| Email: bookings@directtransport.com.au",
      ],
      style: "info_para",
      margin: [0, 10, 0, 0],
    },

    // Remittance Advice
    {
      text: "REMITTANCE ADVICE",
      style: "heading",
      margin: [0, 10, 0, 0],
    },
    {
      text: "Please make your payment to >>>",
      margin: [0, 10, 0, 0],
      style: "para",
    },

    {
      text: "Account : Direct Transport Solutions",
      margin: [0, 10, 0, 0],
      style: "info_heading2",
    },
    {
      text: "BSB : 082 - 356",
      margin: [0, 10, 0, 0],
      style: "info_heading2",
    },
    {
      text: "Acc: 32 273 9836",
      margin: [0, 10, 0, 0],
      style: "info_heading2",
    },
  ];
}
