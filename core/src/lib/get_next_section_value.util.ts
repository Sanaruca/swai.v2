
export function get_next_section_value (value: string) {

    value = value.toUpperCase();

    if (!value) return 'A';

    if(!/^[A-Z]+$/.test(value)) throw new Error('Invalid value');

// Convierte la cadena (por ejemplo, "AZ") a un número en base 26
  let num = 0;
  for (let i = 0; i < value.length; i++) {
    num = num * 26 + (value.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  
  // Incrementa el número en uno
  num++;

  // Convierte el número de vuelta a la representación en letras
  let result = "";
  while (num > 0) {
    const remainder = (num - 1) % 26;
    result = String.fromCharCode(remainder + 'A'.charCodeAt(0)) + result;
    num = Math.floor((num - 1) / 26);
  }
  
  return result;

};