import { PaperSchema } from "../types/paperSchema";

export const paper: PaperSchema = {
  _id: "paper1",
  year: 2025,
  subject: "Combined Science & Mathematics",
  type: "MCQ",
  description:
    "Comprehensive Advanced Level examination covering Pure Mathematics, Chemical Kinetics, Optics, and Data Analysis.",
  questions: [
    {
      question_number: 1,
      question_text:
        "What is the numerical approximation of the mathematical constant $\\pi$ to four significant figures?\n$$\n\\pi = \\lim_{n \\to \\infty} n \\cdot \\sin\\left(\\frac{180^\\circ}{n}\\right)\n$$",
      subject_unit: "Pure Mathematics",
      options: [
        { option_text: "$3.142$", option_image: "", is_correct: true },
        { option_text: "$2.718$", option_image: "", is_correct: false },
        { option_text: "$1.618$", option_image: "", is_correct: false },
        { option_text: "$1.414$", option_image: "", is_correct: false },
      ],
      answer: "The value of $\\pi$ rounded to four significant figures is **$3.142$**.",
      question_images: [],
      marks: 1,
      difficulty: "Easy",
    },
    {
      question_number: 2,
      question_text:
        "Solve the linear equation for $x$:\n$$\n2x + 3 = 7\n$$\nState the unique solution value in the real number domain $\\mathbb{R}$.",
      subject_unit: "Algebra",
      options: [
        { option_text: "$x = 1$", option_image: "", is_correct: false },
        { option_text: "$x = 2$", option_image: "", is_correct: true },
        { option_text: "$x = 3$", option_image: "", is_correct: false },
        { option_text: "$x = 4$", option_image: "", is_correct: false },
      ],
      answer: "Subtract $3$ from both sides: $2x = 4 \\implies x = 2$.",
      question_images: [],
      marks: 1,
      difficulty: "Easy",
    },
    {
      question_number: 3,
      question_text:
        "Consider the redox titration of potassium permanganate with acidified iron(II) sulfate solution:\n$$\n\\ce{MnO4- + 5Fe^{2+} + 8H+ -> Mn^{2+} + 5Fe^{3+} + 4H2O}\n$$\nIf $25.0\\text{ cm}^3$ of $0.020\\text{ mol dm}^{-3}$ $\\ce{KMnO4}$ reacts completely with $20.0\\text{ cm}^3$ of an unknown $\\ce{FeSO4}$ solution, what is the concentration of $\\ce{Fe^{2+}}$ in the sample?",
      subject_unit: "Inorganic Chemistry",
      options: [
        { option_text: "$0.125\\text{ mol dm}^{-3}$", option_image: "", is_correct: true },
        { option_text: "$0.025\\text{ mol dm}^{-3}$", option_image: "", is_correct: false },
        { option_text: "$0.250\\text{ mol dm}^{-3}$", option_image: "", is_correct: false },
        { option_text: "$0.050\\text{ mol dm}^{-3}$", option_image: "", is_correct: false },
      ],
      answer:
        "1. **Moles of $\\ce{MnO4-}$ used**:\n   $$n(\\ce{MnO4-}) = \\frac{25.0 \\times 0.020}{1000} = 5.0 \\times 10^{-4}\\text{ mol}$$\n\n2. **Mole ratio from balanced reaction**:\n   $$\\frac{n(\\ce{Fe^{2+}})}{n(\\ce{MnO4-})} = \\frac{5}{1} \\implies n(\\ce{Fe^{2+}}) = 5 \\times (5.0 \\times 10^{-4}) = 2.5 \\times 10^{-3}\\text{ mol}$$\n\n3. **Concentration of $\\ce{Fe^{2+}}$**:\n   $$[\\ce{Fe^{2+}}] = \\frac{2.5 \\times 10^{-3}\\text{ mol}}{20.0 / 1000\\text{ dm}^3} = 0.125\\text{ mol dm}^{-3}$$",
      question_images: [],
      marks: 3,
      difficulty: "Hard",
    },
    {
      question_number: 4,
      question_text:
        "The initial rates of the gas-phase reaction $\\ce{2NO(g) + O2(g) -> 2NO2(g)}$ at $298\\text{ K}$ were measured experimentally under varied reactant concentrations:\n\n| Trial | $[\\ce{NO}]_0\\text{ (mol dm}^{-3}\\text{)}$ | $[\\ce{O2}]_0\\text{ (mol dm}^{-3}\\text{)}$ | Initial Rate $\\text{(mol dm}^{-3}\\text{ s}^{-1}\\text{)}$ |\n| :--- | :--- | :--- | :--- |\n| **1** | $0.010$ | $0.010$ | $2.5 \\times 10^{-5}$ |\n| **2** | $0.020$ | $0.010$ | $1.0 \\times 10^{-4}$ |\n| **3** | $0.010$ | $0.020$ | $5.0 \\times 10^{-5}$ |\n\nDetermine the correct rate law and overall reaction order.",
      subject_unit: "Physical Chemistry",
      options: [
        {
          option_text: "$\\text{Rate} = k[\\ce{NO}][\\ce{O2}]$ (Second order)",
          option_image: "",
          is_correct: false,
        },
        {
          option_text: "$\\text{Rate} = k[\\ce{NO}]^2[\\ce{O2}]$ (Third order)",
          option_image: "",
          is_correct: true,
        },
        {
          option_text: "$\\text{Rate} = k[\\ce{NO}][\\ce{O2}]^2$ (Third order)",
          option_image: "",
          is_correct: false,
        },
        {
          option_text: "$\\text{Rate} = k[\\ce{NO}]^2[\\ce{O2}]^2$ (Fourth order)",
          option_image: "",
          is_correct: false,
        },
      ],
      answer:
        "Comparing Trials 1 and 2 where $[\\ce{O2}]$ is constant: doubling $[\\ce{NO}]$ quadruples the rate ($\\frac{1.0 \\times 10^{-4}}{2.5 \\times 10^{-5}} = 4 = 2^2$), so order with respect to $\\ce{NO}$ is **2**.\n\nComparing Trials 1 and 3 where $[\\ce{NO}]$ is constant: doubling $[\\ce{O2}]$ doubles the rate ($\\frac{5.0 \\times 10^{-5}}{2.5 \\times 10^{-5}} = 2 = 2^1$), so order with respect to $\\ce{O2}$ is **1**.\n\nTherefore, **$\\text{Rate} = k[\\ce{NO}]^2[\\ce{O2}]$** with total order **$2 + 1 = 3$**.",
      question_images: [],
      marks: 3,
      difficulty: "Hard",
    },
    {
      question_number: 5,
      question_text:
        "A monochromatic laser beam is directed into a glass optical component as illustrated in the schematic diagram below:\n\nThe refractive index of the dense medium is $n = \\sqrt{2}$, and the critical angle for total internal reflection satisfies $\\sin(\\theta_c) = \\frac{1}{n}$. Which of the options below matches the designated reflection profile?",
      subject_unit: "Wave Optics",
      options: [
        {
          option_text: "Internal reflection at critical boundary with $\\theta_c = 45^\\circ$",
          option_image: "/logo.png",
          is_correct: true,
        },
        {
          option_text: "Continuous forward refraction without angular divergence",
          option_image: "/logo-circle.png",
          is_correct: false,
        },
        {
          option_text: "Diffuse surface scattering with wavelength broadening",
          option_image: "/logo.png",
          is_correct: false,
        },
        {
          option_text: "Complete evanescent absorption at the dielectric boundary",
          option_image: "/logo-circle.png",
          is_correct: false,
        },
      ],
      answer:
        "Since $n = \\sqrt{2}$, the critical angle is given by:\n$$\\sin(\\theta_c) = \\frac{1}{\\sqrt{2}} \\implies \\theta_c = 45^\\circ$$\nFor incident angles $\\theta \\ge 45^\\circ$, total internal reflection occurs according to Snell's law.",
      question_images: ["/logo.png"],
      marks: 2,
      difficulty: "Medium",
    },
    {
      question_number: 6,
      question_text:
        "Consider the industrial Haber-Bosch synthesis of ammonia:\n$$\n\\ce{N2(g) + 3H2(g) <=> 2NH3(g)} \\quad \\Delta H^\\circ = -92.4\\text{ kJ mol}^{-1}\n$$\nThe table below categorizes potential operational parameter adjustments:\n\n| Modification Option | Temperature Adjustment | Total System Pressure | Catalyst Added |\n| :--- | :--- | :--- | :--- |\n| **Option I** | Decrease $T$ | Increase $P$ | Finely divided $\\ce{Fe}$ |\n| **Option II** | Increase $T$ | Decrease $P$ | No catalyst |\n| **Option III** | Increase $T$ | Increase $P$ | Solid $\\ce{Pt}$ mesh |\n| **Option IV** | Decrease $T$ | Decrease $P$ | Finely divided $\\ce{Fe}$ |\n\nWhich condition set thermodynamically shifts the equilibrium furthest to the right to maximize the yield of $\\ce{NH3(g)}$?",
      subject_unit: "Chemical Equilibrium",
      options: [
        { option_text: "Option I (Low $T$, High $P$)", option_image: "", is_correct: true },
        { option_text: "Option II (High $T$, Low $P$)", option_image: "", is_correct: false },
        { option_text: "Option III (High $T$, High $P$)", option_image: "", is_correct: false },
        { option_text: "Option IV (Low $T$, Low $P$)", option_image: "", is_correct: false },
      ],
      answer:
        "By **Le Chatelier's Principle**:\n- Because the forward reaction is **exothermic** ($\\Delta H < 0$), decreasing temperature favors the forward formation of $\\ce{NH3}$.\n- Because the forward reaction decreases the number of gas moles ($4\\text{ moles} \\to 2\\text{ moles}$), increasing total pressure favors the forward reaction.\n- Adding an iron catalyst accelerates the rate to reach equilibrium without shifting the position.\n\nTherefore, **Option I** yields the highest fraction of ammonia.",
      question_images: [],
      marks: 2,
      difficulty: "Medium",
    },
    {
      question_number: 7,
      question_text:
        "Evaluate the Vandermonde determinant of order 3 defined by:\n$$\n\\det(V) = \\begin{vmatrix} 1 & x & x^2 \\\\ 1 & y & y^2 \\\\ 1 & z & z^2 \\end{vmatrix}\n$$\nWhich of the following factorized polynomial expressions is equivalent to $\\det(V)$?",
      subject_unit: "Linear Algebra",
      options: [
        { option_text: "$(y - x)(z - x)(z - y)$", option_image: "", is_correct: true },
        { option_text: "$(x + y)(y + z)(z + x)$", option_image: "", is_correct: false },
        { option_text: "$x^2 y^2 z^2 - (x+y+z)$", option_image: "", is_correct: false },
        { option_text: "$(x - y)(y - z)(z - x)$", option_image: "", is_correct: false },
      ],
      answer:
        "Performing elementary row operations $R_2 \\to R_2 - R_1$ and $R_3 \\to R_3 - R_1$:\n$$\n\\begin{vmatrix} 1 & x & x^2 \\\\ 0 & y-x & y^2-x^2 \\\\ 0 & z-x & z^2-x^2 \\end{vmatrix}\n= (y-x)(z-x) \\begin{vmatrix} 1 & y+x \\\\ 1 & z+x \\end{vmatrix} = (y-x)(z-x)(z-y)\n$$",
      question_images: [],
      marks: 2,
      difficulty: "Medium",
    },
    {
      question_number: 8,
      question_text:
        "An algorithm calculates the sum of all elements in a matrix using nested loops:\n```python\ndef compute_trace(matrix):\n    total = 0\n    for i in range(len(matrix)):\n        total += matrix[i][i]  # Summing the main diagonal\n    return total\n```\nWhat is the time complexity $T(n)$ of this algorithm for an $n \\times n$ square matrix?",
      subject_unit: "Algorithms & Complexity",
      options: [
        { option_text: "$\\mathcal{O}(n)$ (Linear time)", option_image: "", is_correct: true },
        {
          option_text: "$\\mathcal{O}(n^2)$ (Quadratic time)",
          option_image: "",
          is_correct: false,
        },
        {
          option_text: "$\\mathcal{O}(\\log n)$ (Logarithmic time)",
          option_image: "",
          is_correct: false,
        },
        { option_text: "$\\mathcal{O}(1)$ (Constant time)", option_image: "", is_correct: false },
      ],
      answer:
        "The loop iterates through indices $i = 0, 1, \\dots, n-1$ exactly once with a single addition per step. Therefore, the time complexity is strictly **$\\mathcal{O}(n)$**.",
      question_images: [],
      marks: 1,
      difficulty: "Easy",
    },
  ],
};
