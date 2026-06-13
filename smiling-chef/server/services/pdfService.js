import { jsPDF } from 'jspdf';
import autoTablePkg from 'jspdf-autotable';

autoTablePkg.applyPlugin(jsPDF);


function numberToWords(num) {
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen'
  ];

  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety'
  ];

  const numToWords = (n) => {
    if (n < 20) return ones[n];

    if (n < 100) {
      return (
        tens[Math.floor(n / 10)] +
        (n % 10 ? ' ' + ones[n % 10] : '')
      );
    }

    if (n < 1000) {
      return (
        ones[Math.floor(n / 100)] +
        ' Hundred' +
        (n % 100 ? ' ' + numToWords(n % 100) : '')
      );
    }

    if (n < 100000) {
      return (
        numToWords(Math.floor(n / 1000)) +
        ' Thousand' +
        (n % 1000 ? ' ' + numToWords(n % 1000) : '')
      );
    }

    if (n < 10000000) {
      return (
        numToWords(Math.floor(n / 100000)) +
        ' Lakh' +
        (n % 100000 ? ' ' + numToWords(n % 100000) : '')
      );
    }

    return (
      numToWords(Math.floor(n / 10000000)) +
      ' Crore' +
      (n % 10000000
        ? ' ' + numToWords(n % 10000000)
        : '')
    );
  };

  if (num === 0) return 'Zero Rupees Only';

  return `${numToWords(Math.floor(num))} Rupees Only`;
}


export async function generateQuotationPDF(data) {
  const {
    customerInfo,
    items,
    gst,
    totalPayable,
    issueDate,
    quotationNumber
  } = data;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 10;

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);

  doc.rect(
    margin,
    margin,
    pageWidth - margin * 2,
    pageHeight - margin * 2
  );

  // =====================
  // HEADER
  // =====================

  const headerHeight = 35;

  doc.rect(
    margin,
    margin,
    pageWidth - margin * 2,
    headerHeight
  );

  doc.setTextColor(0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(
    'Quotation',
    pageWidth - 65,
    margin + 12
  );

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  doc.text(
    `Issue Date: ${issueDate}`,
    pageWidth - 65,
    margin + 20
  );

  doc.text(
    `Quotation #: ${quotationNumber}`,
    pageWidth - 65,
    margin + 26
  );

  // =====================
  // CUSTOMER SECTION
  // =====================

  const customerBoxY = margin + headerHeight;

  const customerBoxHeight = 32;

  doc.rect(
    margin,
    customerBoxY,
    pageWidth - margin * 2,
    customerBoxHeight
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);

  doc.text(
    'Customer Information',
    margin + 5,
    customerBoxY + 6
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  const col1X = 15;
  const col2X = 70;
  const col3X = 150;

  const row1 = customerBoxY + 14;
  const row2 = customerBoxY + 22;
  const row3 = customerBoxY + 30;

  doc.text(
    `Name: ${customerInfo.name || 'N/A'}`,
    col1X,
    row1
  );

  doc.text(
    `Mobile: ${customerInfo.phone || 'N/A'}`,
    col2X,
    row1
  );

  const emailLines = doc.splitTextToSize(
    `Email: ${customerInfo.email || 'N/A'}`,
    80
  );

  doc.text(emailLines, col3X, row1);

  doc.text(
    `Location: ${customerInfo.location || 'N/A'}`,
    col1X,
    row2
  );

  doc.text(
    `People: ${customerInfo.numberOfPeople || 'N/A'}`,
    col2X,
    row2
  );

  doc.text(
    `Event Date: ${customerInfo.eventDate || 'N/A'}`,
    col1X,
    row3
  );

  doc.text(
    `Event Type: ${customerInfo.occasion || 'N/A'}`,
    col2X,
    row3
  );

  // =====================
  // TABLE
  // =====================

  const tableStartY =
    customerBoxY + customerBoxHeight + 5;

  const peopleCount = Number(customerInfo.numberOfPeople) || 1;

  const rows = items.map((item, index) => {
    const unitPrice = Number(item.price) || 0;
    const totalPrice = unitPrice * peopleCount;

    return [
      index + 1,
      item.name,
      item.cuisineName,
      item.veg ? 'Veg' : 'Non-Veg',
      unitPrice,
      totalPrice
    ];
  });

  const totalPriceSum = rows.reduce(
    (sum, row) => sum + (Number(row[5]) || 0),
    0
  );

  rows.push([
    '',
    '',
    '',
    {
      content: 'IGST (18%)',
      styles: {
        fontStyle: 'bold',
        halign: 'right'
      }
    },
    '',
    gst
  ]);

  doc.autoTable({
    startY: tableStartY,

    head: [
      [
        'Sr. No.',
        'Menu Name',
        'Cuisine',
        'Food Type',
        'Price (Rs.)',
        'Total Price (Rs.)'
      ]
    ],

    body: rows,

    theme: 'grid',

    headStyles: {
      fillColor: [25, 25, 112],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center'
    },

    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineWidth: 0.2
    },

    columnStyles: {
      0: {
        cellWidth: 15,
        halign: 'center'
      },

      1: {
        cellWidth: 70
      },

      2: {
        cellWidth: 45
      },

      3: {
        cellWidth: 25,
        halign: 'center'
      },

      4: {
        cellWidth: 35,
        halign: 'right'
      },

      5: {
        cellWidth: 35,
        halign: 'right'
      }
    },

  });

  const totalsY = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(
    `Total Price (Rs.): ${totalPriceSum.toLocaleString()}`,
    pageWidth - margin - 5,
    totalsY,
    { align: 'right' }
  );

  // =====================
  // TOTALS
  // =====================

  const finalY = totalsY + 8;

  doc.rect(
    margin,
    finalY,
    pageWidth - margin * 2,
    8
  );

  doc.setFontSize(9);

  doc.text(
    `Total Amount in Words: ${numberToWords(
      totalPayable
    )}`,
    margin + 3,
    finalY + 5
  );

  const totalY = finalY + 15;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);

  doc.setTextColor(255, 0, 0);

  doc.text(
    `Grand Total: Rs. ${totalPayable.toLocaleString()}`,
    pageWidth - 12,
    totalY,
    {
      align: 'right'
    }
  );

  // =====================
  // FOOTER
  // =====================

  doc.setTextColor(0);

  doc.setFontSize(9);

  doc.setFont('helvetica', 'italic');

  doc.text(
    'This is a Computer Generated Quotation',
    pageWidth / 2,
    pageHeight - 8,
    {
      align: 'center'
    }
  );

  return doc.output('arraybuffer');
}

export default generateQuotationPDF;