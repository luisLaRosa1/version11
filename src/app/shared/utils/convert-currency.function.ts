export function convertCurrency(numero: any) {
    let data = 0;
  
    if (numero === undefined || numero === null || numero === 0) return 0;
  
    if (typeof numero === 'string' && numero.length === 1) return numero;
  
    if (typeof numero === 'number') {
      data = numero;
    }
  
    if (typeof numero === 'string') {
      data = parseFloat(numero.replace(/,/g, ''));
    }
  
    let formatCurrency = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(data);
    formatCurrency = formatCurrency.slice(1);
  
    return formatCurrency;
  }
  