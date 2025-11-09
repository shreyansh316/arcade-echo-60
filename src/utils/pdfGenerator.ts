export const generateInvoicePDF = (games: Array<{ title: string; price: string; priceValue: number }>, total: number) => {
  // Create PDF content
  const pdfContent = {
    content: [
      { text: 'GAMEVERSE INVOICE', style: 'header', alignment: 'center' },
      { text: `Date: ${new Date().toLocaleDateString()}`, style: 'subheader', alignment: 'center', margin: [0, 10, 0, 20] },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto'],
          body: [
            ['Game', 'Price', 'Quantity'],
            ...games.map((game) => [game.title, game.price, '1']),
            ['', { text: 'Subtotal:', bold: true }, `$${total.toFixed(2)}`],
            ['', { text: 'Tax (10%):', bold: true }, `$${(total * 0.1).toFixed(2)}`],
            ['', { text: 'Total:', bold: true, fontSize: 16 }, { text: `$${(total * 1.1).toFixed(2)}`, bold: true, fontSize: 16 }],
          ],
        },
      },
      { text: 'Thank you for your purchase!', style: 'footer', alignment: 'center', margin: [0, 20, 0, 0] },
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
      },
      subheader: {
        fontSize: 14,
      },
      footer: {
        fontSize: 12,
        italics: true,
      },
    },
  };

  // For now, we'll create a simple text-based receipt and download it
  // In a real app, you'd use a library like pdfmake or jsPDF
  const receiptText = `
GAMEVERSE INVOICE
Date: ${new Date().toLocaleDateString()}

${games.map((game) => `${game.title} - ${game.price}`).join('\n')}

Subtotal: $${total.toFixed(2)}
Tax (10%): $${(total * 0.1).toFixed(2)}
Total: $${(total * 1.1).toFixed(2)}

Thank you for your purchase!
  `.trim();

  // Create blob and download
  const blob = new Blob([receiptText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

