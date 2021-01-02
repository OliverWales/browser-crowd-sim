export class AgentMesh {
  // prettier-ignore
  static vertices = [
    0.288463, -0.314, 1.836123,
    0.288463, -0.314, 3.396424,
    -0.288463, -0.314, 1.836123,
    -0.288463, -0.314, 3.396424,
    0.288463, 0.314, 1.836123,
    0.288463, 0.314, 3.396424,
    -0.288463, 0.314, 1.836123,
    -0.288463, 0.314, 3.396424,
    -0.189141, 0.184727, 4.025087,
    -0.189141, 0.184727, 3.493465,
    0.254771, 0.184727, 4.025087,
    0.254771, 0.184727, 3.493465,
    -0.189141, -0.184727, 4.025087,
    -0.189141, -0.184727, 3.493465,
    0.254771, -0.184727, 4.025087,
    0.254771, -0.184727, 3.493465,
    0.15159, 0.104367, 0.322361,
    0.15159, 0.104367, 1.750607,
    -0.15159, 0.104367, 0.322361,
    -0.15159, 0.104367, 1.750607,
    0.15159, 0.407546, 0.322361,
    0.15159, 0.407546, 1.750607,
    -0.15159, 0.407546, 0.322361,
    -0.15159, 0.407546, 1.750607,
    0.411838, 0.104367, 0.0,
    -0.233453, 0.104367, 0.0,
    0.411838, 0.407546, 0.0,
    -0.233453, 0.407546, 0.0,
    0.411838, 0.104367, 0.227881,
    -0.233453, 0.104367, 0.227881,
    0.411838, 0.407546, 0.227881,
    -0.233453, 0.407546, 0.227881,
    0.045505, 0.376526, 1.797839,
    0.045505, 0.376526, 3.247407,
    -0.155762, 0.376526, 1.797839,
    -0.155762, 0.376526, 3.247407,
    0.045505, 0.588396, 1.797839,
    0.045505, 0.588396, 3.247407,
    -0.155762, 0.588396, 1.797839,
    -0.155762, 0.588396, 3.247407,
    0.15159, -0.104367, 0.322361,
    0.15159, -0.104367, 1.750607,
    -0.15159, -0.104367, 0.322361,
    -0.15159, -0.104367, 1.750607,
    0.15159, -0.407546, 0.322361,
    0.15159, -0.407546, 1.750607,
    -0.15159, -0.407546, 0.322361,
    -0.15159, -0.407546, 1.750607,
    0.411838, -0.104367, 0.0,
    -0.233453, -0.104367, 0.0,
    0.411838, -0.407546, 0.0,
    -0.233453, -0.407546, 0.0,
    0.411838, -0.104367, 0.227881,
    -0.233453, -0.104367, 0.227881,
    0.411838, -0.407546, 0.227881,
    -0.233453, -0.407546, 0.227881,
    0.045505, -0.376526, 1.797839,
    0.045505, -0.376526, 3.247407,
    -0.155762, -0.376526, 1.797839,
    -0.155762, -0.376526, 3.247407,
    0.045505, -0.588396, 1.797839,
    0.045505, -0.588396, 3.247407,
    -0.155762, -0.588396, 1.797839,
    -0.155762, -0.588396, 3.247407,
  ];

  // prettier-ignore
  static indices = [
    1, 2, 0,
    3, 6, 2,
    7, 4, 6,
    5, 0, 4,
    6, 0, 2,
    3, 5, 7,
    9, 15, 13,
    12, 9, 13,
    14, 13, 15,
    10, 15, 11,
    12, 10, 8,
    8, 11, 9,
    17, 18, 16,
    19, 22, 18,
    23, 20, 22,
    21, 16, 20,
    22, 16, 18,
    19, 21, 23,
    24, 27, 25,
    31, 28, 29,
    25, 28, 24,
    24, 30, 26,
    27, 29, 25,
    26, 31, 27,
    33, 34, 32,
    35, 38, 34,
    39, 36, 38,
    37, 32, 36,
    38, 32, 34,
    35, 37, 39,
    41, 42, 40,
    43, 46, 42,
    47, 44, 46,
    45, 40, 44,
    46, 40, 42,
    43, 45, 47,
    48, 51, 49,
    55, 52, 53,
    49, 52, 48,
    48, 54, 50,
    51, 53, 49,
    50, 55, 51,
    57, 58, 56,
    59, 62, 58,
    63, 60, 62,
    61, 56, 60,
    62, 56, 58,
    59, 61, 63,
    1, 3, 2,
    3, 7, 6,
    7, 5, 4,
    5, 1, 0,
    6, 4, 0,
    3, 1, 5,
    9, 11, 15,
    12, 8, 9,
    14, 12, 13,
    10, 14, 15,
    12, 14, 10,
    8, 10, 11,
    17, 19, 18,
    19, 23, 22,
    23, 21, 20,
    21, 17, 16,
    22, 20, 16,
    19, 17, 21,
    24, 26, 27,
    31, 30, 28,
    25, 29, 28,
    24, 28, 30,
    27, 31, 29,
    26, 30, 31,
    33, 35, 34,
    35, 39, 38,
    39, 37, 36,
    37, 33, 32,
    38, 36, 32,
    35, 33, 37,
    41, 43, 42,
    43, 47, 46,
    47, 45, 44,
    45, 41, 40,
    46, 44, 40,
    43, 41, 45,
    48, 50, 51,
    55, 54, 52,
    49, 53, 52,
    48, 52, 54,
    51, 55, 53,
    50, 54, 55,
    57, 59, 58,
    59, 63, 62,
    63, 61, 60,
    61, 57, 56,
    62, 60, 56,
    59, 57, 61,
  ];
}
