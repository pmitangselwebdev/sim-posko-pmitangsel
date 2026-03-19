import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateReportPDF = async (reportData, reportType) => {
  if (reportType === 'assessment-report') {
    // Create assessment report PDF
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Set font
    pdf.setFont('helvetica');

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LAPORAN ASSESSMENT', 105, 20, { align: 'center' });

    pdf.setFontSize(16);
    pdf.text('PALANG MERAH INDONESIA', 105, 35, { align: 'center' });

    // Date
    pdf.setFontSize(10);
    pdf.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, 50);

    let yPosition = 70;

    if (reportData) {
      // Assessment Type
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Jenis Assessment:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(reportData.type === 'bencana' ? 'Assessment Bencana' : 'Assessment Ambulance', 60, yPosition);
      yPosition += 15;

      // Location
      pdf.setFont('helvetica', 'bold');
      pdf.text('Lokasi:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(reportData.lokasi || '-', 60, yPosition);
      yPosition += 15;

      // Officer
      pdf.setFont('helvetica', 'bold');
      pdf.text('Petugas:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(reportData.namaPetugas || '-', 60, yPosition);
      yPosition += 15;

      // Disaster Type
      if (reportData.jenisBencana) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Jenis Bencana:', 20, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(reportData.jenisBencana, 60, yPosition);
        yPosition += 15;
      }

      // Incident Time
      if (reportData.waktuKejadian) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Waktu Kejadian:', 20, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(new Date(reportData.waktuKejadian).toLocaleString('id-ID'), 60, yPosition);
        yPosition += 15;
      }

      yPosition += 10;

      // Victims Information
      if (reportData.jumlahKorbanMeninggal !== undefined) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Informasi Korban', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Meninggal: ${reportData.jumlahKorbanMeninggal || 0}`, 25, yPosition);
        yPosition += 8;
        pdf.text(`Luka Berat: ${reportData.jumlahKorbanLukaBerat || 0}`, 25, yPosition);
        yPosition += 8;
        pdf.text(`Luka Ringan: ${reportData.jumlahKorbanLukaRingan || 0}`, 25, yPosition);
        yPosition += 8;
        pdf.text(`Hilang: ${reportData.jumlahKorbanHilang || 0}`, 25, yPosition);
        yPosition += 15;
      }

      // Infrastructure Damage
      if (reportData.rumahRusakBerat !== undefined) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Kerusakan Infrastruktur', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Rumah Rusak Berat: ${reportData.rumahRusakBerat || 0}`, 25, yPosition);
        yPosition += 8;
        pdf.text(`Rumah Rusak Ringan: ${reportData.rumahRusakRingan || 0}`, 25, yPosition);
        yPosition += 15;
      }

      // Security Situation
      if (reportData.situasiKeamanan) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Situasi Keamanan', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const securityLines = pdf.splitTextToSize(reportData.situasiKeamanan, 150);
        pdf.text(securityLines, 25, yPosition);
        yPosition += securityLines.length * 5 + 10;
      }

      // Urgent Needs
      if (reportData.kebutuhanPMI || reportData.kebutuhanKorban) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Kebutuhan Mendesak', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        if (reportData.kebutuhanPMI) {
          pdf.text('PMI:', 25, yPosition);
          yPosition += 8;
          const pmiLines = pdf.splitTextToSize(reportData.kebutuhanPMI, 150);
          pdf.text(pmiLines, 30, yPosition);
          yPosition += pmiLines.length * 5 + 5;
        }

        if (reportData.kebutuhanKorban) {
          pdf.text('Korban:', 25, yPosition);
          yPosition += 8;
          const korbanLines = pdf.splitTextToSize(reportData.kebutuhanKorban, 150);
          pdf.text(korbanLines, 30, yPosition);
          yPosition += korbanLines.length * 5 + 5;
        }
      }
    }

    return pdf;
  }

  if (reportType === 'laporan-situasi') {
    // Update the hidden template with actual data
    const templateElement = document.querySelector('#laporan-situasi-pdf');
    if (templateElement) {
      // Force re-render by updating the template data
      const templateContainer = templateElement.parentElement;
      if (templateContainer) {
        // Remove and re-add the template with new data
        templateContainer.innerHTML = '';
        const newTemplate = document.createElement('div');
        newTemplate.innerHTML = `
          <div
            id="laporan-situasi-pdf"
            style="
              width: 210mm;
              min-height: 297mm;
              padding: 15mm;
              font-family: Arial, sans-serif;
              font-size: 10pt;
              line-height: 1.4;
              color: #000;
              box-sizing: border-box;
              background: white;
            "
          >
            <div style="text-align: center; margin-bottom: 12px;">
              <h2 style="font-size: 16pt; font-weight: bold; margin: 0;">LAPORAN SITUASI 01</h2>
              <div style="margin-top: 4px;">
                <strong>Kejadian Bencana:</strong> ${reportData?.jenisKejadian || '________________________'}<br />
                <strong>Lokasi:</strong> ${reportData?.lokasiTerdampak || '________________________'}<br />
                <strong>Waktu Kejadian:</strong> ${reportData?.tanggalKejadian ? `${reportData.tanggalKejadian} ${reportData.waktuKejadian || ''} ${reportData.zonaWaktu || ''}` : '________________________'}<br />
                <strong>Update:</strong> ${new Date().toLocaleString('id-ID')}
              </div>
              <div style="margin-top: 6px;">
                <strong>Pemerintah membutuhkan dukungan internasional:</strong> TIDAK
              </div>
            </div>
            <hr style="margin: 12px 0; border: none; border-top: 1px solid #000;" />
            <h3 style="font-size: 12pt; font-weight: bold; margin-top: 10px;">Gambaran Umum Situasi</h3>
            <p style="white-space: pre-wrap; min-height: 60px;">
              ${reportData?.deskripsiKejadian || '________________________________________________________________________________\n________________________________________________________________________________'}
            </p>
            <h3 style="font-size: 12pt; font-weight: bold; margin-top: 14px;">Dampak Bencana</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 6px;">
              <tbody>
                <tr><td style="width: 50%; padding: 4px 0;">Korban Meninggal</td><td style="width: 50%; padding: 4px 0;">: ${reportData?.korbanMeninggal || '________'}</td></tr>
                <tr><td style="padding: 4px 0;">Korban Hilang</td><td style="padding: 4px 0;">: ${reportData?.korbanHilang || '________'}</td></tr>
                <tr><td style="padding: 4px 0;">Luka Berat</td><td style="padding: 4px 0;">: ${reportData?.lukaBerat || '________'}</td></tr>
                <tr><td style="padding: 4px 0;">Luka Ringan</td><td style="padding: 4px 0;">: ${reportData?.lukaRingan || '________'}</td></tr>
                <tr><td style="padding: 4px 0;">Jumlah Pengungsi (Jiwa)</td><td style="padding: 4px 0;">: ${reportData?.jumlahPengungsi || '________'}</td></tr>
                <tr><td style="padding: 4px 0;">Jumlah KK Terdampak</td><td style="padding: 4px 0;">: ${reportData?.jumlahKKTerdampak || '________'}</td></tr>
              </tbody>
            </table>
            <h3 style="font-size: 12pt; font-weight: bold; margin-top: 14px;">Kerusakan Infrastruktur</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 6px;">
              <tbody>
                <tr><td style="width: 60%; padding: 4px 0;">Rumah Rusak Berat</td><td style="width: 40%; padding: 4px 0;">: ${reportData?.rumahRusakBerat || '________'}</td></tr>
                <tr><td style="padding: 4px 0;">Rumah Rusak Sedang</td><td style="padding: 4px 0;">: ${reportData?.rumahRusakSedang || '________'}</td></tr>
                <tr><td style="padding: 4px 0;">Rumah Rusak Ringan</td><td style="padding: 4px 0;">: ${reportData?.rumahRusakRingan || '________'}</td></tr>
                <tr><td style="padding: 4px 0;">Sekolah Rusak</td><td style="padding: 4px 0;">: ${reportData?.sekolahRusak || '________'}</td></tr>
                <tr><td style="padding: 4px 0;">Fasilitas Kesehatan Rusak</td><td style="padding: 4px 0;">: ${reportData?.fasilitasKesehatanRusak || '________'}</td></tr>
                <tr><td style="padding: 4px 0;">Tempat Ibadah Rusak</td><td style="padding: 4px 0;">: ${reportData?.tempatIbadahRusak || '________'}</td></tr>
              </tbody>
            </table>
            <h3 style="font-size: 12pt; font-weight: bold; margin-top: 14px;">Layanan PMI</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 6px;">
              <tbody>
                <tr><td style="width: 70%; padding: 4px 0;">Pelayanan Kesehatan</td><td style="width: 30%; padding: 4px 0;">: ${reportData?.pelayananKesehatan || '________'} jiwa</td></tr>
                <tr><td style="padding: 4px 0;">Pelayanan Psikososial (PSP)</td><td style="padding: 4px 0;">: ${reportData?.pelayananPsikososial || '________'} jiwa</td></tr>
                <tr><td style="padding: 4px 0;">Dapur Umum</td><td style="padding: 4px 0;">: ${reportData?.paketDapurUmum || '________'} paket</td></tr>
                <tr><td style="padding: 4px 0;">Distribusi Air Bersih</td><td style="padding: 4px 0;">: ${reportData?.distribusiAirBersih || '________'} liter</td></tr>
                <tr><td style="padding: 4px 0;">Hygiene Kit</td><td style="padding: 4px 0;">: ${reportData?.hygieneKit || '________'} unit</td></tr>
                <tr><td style="padding: 4px 0;">Family Kit</td><td style="padding: 4px 0;">: ${reportData?.familyKit || '________'} unit</td></tr>
                <tr><td style="padding: 4px 0;">Emergency Shelter</td><td style="padding: 4px 0;">: ${reportData?.emergencyShelter || '________'} KK</td></tr>
                <tr><td style="padding: 4px 0;">Pelayanan RFL</td><td style="padding: 4px 0;">: ${reportData?.permintaanRFL || '________'} permintaan</td></tr>
              </tbody>
            </table>
            <h3 style="font-size: 12pt; font-weight: bold; margin-top: 14px;">Kebutuhan Mendesak</h3>
            <p style="min-height: 40px; white-space: pre-wrap;">
              ${reportData?.kebutuhanMendesak || '________________________________________________________________________________'}
            </p>
            <h3 style="font-size: 12pt; font-weight: bold; margin-top: 14px;">Hambatan di Lapangan</h3>
            <p style="min-height: 40px; white-space: pre-wrap;">
              ${reportData?.hambatanLapangan || '________________________________________________________________________________'}
            </p>
            <h3 style="font-size: 12pt; font-weight: bold; margin-top: 14px;">Aksesibilitas Lokasi</h3>
            <p style="min-height: 30px; white-space: pre-wrap;">
              ${reportData?.aksesibilitasLokasi || '________________________________________________________________________________'}
            </p>
            <h3 style="font-size: 12pt; font-weight: bold; margin-top: 14px;">Personil yang Dapat Dihubungi</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 6px;">
              <thead>
                <tr>
                  <th style="border: 1px solid #000; padding: 4px; text-align: left;">Nama Lengkap</th>
                  <th style="border: 1px solid #000; padding: 4px; text-align: left;">Posisi</th>
                  <th style="border: 1px solid #000; padding: 4px; text-align: left;">Kontak</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #000; padding: 4px;">${reportData?.namaPelapor || '________________'}</td>
                  <td style="border: 1px solid #000; padding: 4px;">${reportData?.posisiPelapor || '________________'}</td>
                  <td style="border: 1px solid #000; padding: 4px;">${reportData?.kontakPelapor || '________________'}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; padding: 4px;">________________</td>
                  <td style="border: 1px solid #000; padding: 4px;">________________</td>
                  <td style="border: 1px solid #000; padding: 4px;">________________</td>
                </tr>
              </tbody>
            </table>
            <div style="margin-top: 20px; text-align: center; font-size: 9pt; color: #555;">
              <em>Dokumen ini dibuat oleh Palang Merah Indonesia – ${new Date().toLocaleDateString('id-ID')}</em>
            </div>
          </div>
        `;
        templateContainer.appendChild(newTemplate);
      }
    }

    // Wait a bit for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));

    const element = document.getElementById('laporan-situasi-pdf');
    if (!element) {
      throw new Error('PDF template element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf;
  } else {
    // Keep the original PDF generation for daily reports
    const pdf = new jsPDF();

    // Set font
    pdf.setFont('helvetica');

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PALANG MERAH INDONESIA', 105, 20, { align: 'center' });

    pdf.setFontSize(16);
    pdf.text('LAPORAN POSKO', 105, 35, { align: 'center' });

    // Report type
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    const typeText = reportType === 'laporan-harian' ? 'Laporan Harian' : 'Laporan Situasi Bencana';
    pdf.text(typeText, 105, 50, { align: 'center' });

    // Date
    pdf.setFontSize(10);
    pdf.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, 70);

    let yPosition = 90;

    if (reportType === 'laporan-harian') {
      // Daily Report Content
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Informasi Laporan Harian', 20, yPosition);
      yPosition += 15;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);

      pdf.text(`Shift: ${reportData.shift === 'Shift 1' ? 'Shift 1 (08:00-20:00)' : 'Shift 2 (20:00-08:00)'}`, 20, yPosition);
      yPosition += 10;

      pdf.text(`Aktivitas Utama:`, 20, yPosition);
      yPosition += 8;

      // Split long text
      const aktivitasLines = pdf.splitTextToSize(reportData.aktivitas || '-', 170);
      pdf.text(aktivitasLines, 25, yPosition);
      yPosition += aktivitasLines.length * 5 + 10;

      pdf.text(`Jumlah Panggilan: ${reportData.jumlahPanggilan || 0}`, 20, yPosition);
      yPosition += 10;

      pdf.text(`Jumlah Rujukan: ${reportData.jumlahRujukan || 0}`, 20, yPosition);
      yPosition += 10;

      if (reportData.catatan) {
        pdf.text(`Catatan:`, 20, yPosition);
        yPosition += 8;
        const catatanLines = pdf.splitTextToSize(reportData.catatan, 170);
        pdf.text(catatanLines, 25, yPosition);
      }
    }

    return pdf;
  }
};

export const generateSchedulePDF = async (schedules, currentMonth, currentYear) => {
  const pdf = new jsPDF('p', 'mm', 'a4');

  // Set font
  pdf.setFont('helvetica');

  // Add header image at the very top (0 margin)
  try {
    // Load header image from public folder
    const img = new Image();
    img.src = '/images/Header.png';

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Convert image to canvas for PDF
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imgData = canvas.toDataURL('image/png');

    // Calculate dimensions to fit the page width, maintain aspect ratio
    const pageWidth = 210; // A4 width in mm
    const imgAspectRatio = img.width / img.height;
    const imgWidth = pageWidth;
    const imgHeight = imgWidth / imgAspectRatio;

    // Place image at the very top (0 margin)
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  } catch (error) {
    console.log('Header image not available, using text placeholder');
    // Fallback to text if image fails to load
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PALANG MERAH INDONESIA', 105, 10, { align: 'center' });
    pdf.text('POSKO PMI KOTA TANGERANG SELATAN', 105, 20, { align: 'center' });
  }

  // Title section - positioned after header image
  let titleY = 50; // Adjust based on header image height

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Jadwal Piket', 105, titleY, { align: 'center' });

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('POSKO PMI KOTA TANGERANG SELATAN', 105, titleY + 10, { align: 'center' });

  // Month
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  });
  pdf.text(`Bulan ${monthName}`, 105, titleY + 25, { align: 'center' });

  // Group schedules by date
  const schedulesByDate = schedules.reduce((acc, schedule) => {
    const dateKey = new Date(schedule.tanggal).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(schedule);
    return acc;
  }, {});

  // Get calendar data
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay())); // End on Saturday

  const calendarDays = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // Calendar grid settings
  const calendarStartY = titleY + 40;
  const cellWidth = 25; // mm
  const cellHeight = 20; // mm
  const startX = 10; // mm

  // Draw day headers with modern styling
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Header background
  pdf.setFillColor(41, 128, 185); // Blue background
  pdf.rect(startX, calendarStartY - 6, cellWidth * 7, 8, 'F');

  // Header text
  pdf.setTextColor(255, 255, 255); // White text
  for (let i = 0; i < 7; i++) {
    const x = startX + (i * cellWidth);
    pdf.text(dayHeaders[i], x + cellWidth/2, calendarStartY, { align: 'center' });
  }

  // Draw calendar cells with modern styling
  pdf.setTextColor(0, 0, 0); // Reset to black

  let currentY = calendarStartY + 8;
  let cellsInRow = 0;
  let rowIndex = 0;

  calendarDays.forEach((day, index) => {
    const x = startX + (cellsInRow * cellWidth);
    const isCurrentMonth = day.getMonth() === currentMonth;
    const dateKey = day.toDateString();
    const daySchedules = schedulesByDate[dateKey] || [];
    const isToday = day.toDateString() === new Date().toDateString();

    // Alternate row colors for better readability
    const isEvenRow = rowIndex % 2 === 0;

    // Cell background color
    if (isToday && isCurrentMonth) {
      pdf.setFillColor(255, 235, 59); // Yellow for today
    } else if (isCurrentMonth) {
      if (isEvenRow) {
        pdf.setFillColor(255, 255, 255); // White
      } else {
        pdf.setFillColor(248, 249, 250); // Light gray
      }
    } else {
      pdf.setFillColor(245, 245, 245); // Light gray for other months
    }

    // Draw cell background
    pdf.rect(x, currentY - 5, cellWidth, cellHeight, 'F');

    // Draw cell border
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(x, currentY - 5, cellWidth, cellHeight);

    // Date number with styling
    pdf.setFontSize(8);
    if (isCurrentMonth) {
      if (isToday) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(231, 76, 60); // Red for today
      } else {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(52, 73, 94); // Dark blue for current month
      }
      pdf.text(day.getDate().toString(), x + 2, currentY);
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(150, 150, 150); // Gray for other months
      pdf.text(day.getDate().toString(), x + 2, currentY);
    }

    // Staff names with modern styling
    if (daySchedules.length > 0 && isCurrentMonth) {
      pdf.setTextColor(46, 125, 50); // Green for staff names
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(5);

      const maxStaff = 3; // Show max 3 staff names
      const staffToShow = daySchedules.slice(0, maxStaff);

      staffToShow.forEach((schedule, idx) => {
        const staffY = currentY + 3 + (idx * 2.5);
        if (staffY < currentY + cellHeight - 2) {
          const shortName = schedule.user.namaLengkap.split(' ')[0];
          pdf.text(shortName, x + 2, staffY);
        }
      });

      // Show count if more staff with badge-like styling
      if (daySchedules.length > maxStaff) {
        const countY = currentY + 3 + (maxStaff * 2.5);
        if (countY < currentY + cellHeight - 2) {
          pdf.setFontSize(4);
          pdf.setTextColor(255, 255, 255);
          pdf.setFillColor(244, 67, 54); // Red background for count
          pdf.rect(x + 1, countY - 1, 8, 3, 'F');
          pdf.text(`+${daySchedules.length - maxStaff}`, x + 2, countY);
        }
      }
    }

    cellsInRow++;

    // New row every 7 cells
    if (cellsInRow === 7) {
      cellsInRow = 0;
      currentY += cellHeight;
      rowIndex++;

      // New page if needed
      if (currentY > 250) {
        pdf.addPage();
        currentY = 30;
        rowIndex = 0;

        // Repeat headers on new page with same styling
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setFillColor(41, 128, 185);
        pdf.rect(startX, currentY - 6, cellWidth * 7, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        for (let i = 0; i < 7; i++) {
          const headerX = startX + (i * cellWidth);
          pdf.text(dayHeaders[i], headerX + cellWidth/2, currentY, { align: 'center' });
        }
        pdf.setTextColor(0, 0, 0);
        currentY += 8;
      }
    }
  });

  // Footer
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'italic');
  pdf.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 10, 285);
  pdf.text('Dokumen ini dibuat oleh Sistem Informasi Posko PMI', 105, 285, { align: 'center' });

  return pdf;
};

export const downloadPDF = (pdf, filename) => {
  pdf.save(filename);
};

// New function for generating ambulance report PDF
export const generateAmbulanceReportPDF = async (ambulanceForm) => {
  const pdf = new jsPDF('p', 'mm', 'a4');

  // Set font
  pdf.setFont('helvetica');

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('KARTU LUKA', 105, 20, { align: 'center' });

  pdf.setFontSize(16);
  pdf.text('LOMBA PERTOLONGAN PERTAMA', 105, 35, { align: 'center' });

  // Date
  pdf.setFontSize(10);
  pdf.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, 50);

  let yPosition = 70;

  // BIO DATA
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BIO DATA', 20, yPosition);
  yPosition += 15;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);

  // Nama korban
  pdf.text(`Nama korban: ${ambulanceForm.data.namaKorban || '________________________'}`, 20, yPosition);
  yPosition += 10;

  // Alamat
  pdf.text(`Alamat: ${ambulanceForm.data.alamat || '________________________'}`, 20, yPosition);
  yPosition += 10;

  // Nama saksi
  pdf.text(`Nama saksi: ${ambulanceForm.data.namaSaksi || '________________________'}`, 20, yPosition);
  yPosition += 10;

  // Alamat saksi
  pdf.text(`Alamat: ${ambulanceForm.data.alamatSaksi || '________________________'}`, 20, yPosition);
  yPosition += 10;

  // Phone
  pdf.text(`Phone: ${ambulanceForm.data.nomorTelepon || '________________________'}`, 20, yPosition);
  yPosition += 20;

  // PENILAIAN DINI
  pdf.setFont('helvetica', 'bold');
  pdf.text('PENILAIAN DINI', 20, yPosition);
  yPosition += 15;

  pdf.setFont('helvetica', 'normal');

  // Kesan Umum
  pdf.text(`Kesan Umum: ${ambulanceForm.data.jenisKejadian || 'Trauma / Medis'}`, 20, yPosition);
  yPosition += 10;

  // Respon
  pdf.text(`Respon: ${ambulanceForm.data.respon || 'Awas/Suara/Nyeri/Tidak Respon'}`, 20, yPosition);
  yPosition += 10;

  // Nafas
  pdf.text(`Nafas: ${ambulanceForm.data.nafas || 'Ada / Tidak'}`, 20, yPosition);
  yPosition += 10;

  // Nadi
  pdf.text(`Nadi: ${ambulanceForm.data.nadi || 'Ada / Tidak'}`, 20, yPosition);
  yPosition += 10;

  // Perdarahan Besar
  pdf.text(`Perdarahan Besar: ${ambulanceForm.data.perdarahanBesar || 'Ada / Tidak'}`, 20, yPosition);
  yPosition += 20;

  // JENIS LUKA
  pdf.setFont('helvetica', 'bold');
  pdf.text('JENIS LUKA', 20, yPosition);
  yPosition += 15;

  pdf.setFont('helvetica', 'normal');

  // Jenis luka 1
  pdf.text(`1. ${ambulanceForm.data.jenisCedera || '____________________________________'}`, 20, yPosition);
  yPosition += 10;

  // Jenis luka 2
  pdf.text(`2. ${ambulanceForm.data.jenisCedera2 || '____________________________________'}`, 20, yPosition);
  yPosition += 10;

  // Jenis luka 3
  pdf.text(`3. ${ambulanceForm.data.jenisCedera3 || '____________________________________'}`, 20, yPosition);
  yPosition += 20;

  // PERTOLONGAN YANG DILAKUKAN
  pdf.setFont('helvetica', 'bold');
  pdf.text('PERTOLONGAN YANG DILAKUKAN:', 20, yPosition);
  yPosition += 15;

  pdf.setFont('helvetica', 'normal');

  // Pertolongan 1
  pdf.text(`1. ${ambulanceForm.data.penjelasanTindakan || '____________________________________'}`, 20, yPosition);
  yPosition += 10;
  pdf.text('   _________________________________________', 20, yPosition);
  yPosition += 10;

  // Pertolongan 2
  pdf.text(`2. ${ambulanceForm.data.penjelasanTindakan2 || '____________________________________'}`, 20, yPosition);
  yPosition += 10;
  pdf.text('   _________________________________________', 20, yPosition);
  yPosition += 10;

  // Pertolongan 3
  pdf.text(`3. ${ambulanceForm.data.penjelasanTindakan3 || '____________________________________'}`, 20, yPosition);
  yPosition += 10;
  pdf.text('   _________________________________________', 20, yPosition);
  yPosition += 20;

  // TANDA VITAL
  pdf.setFont('helvetica', 'bold');
  pdf.text('TANDA VITAL', 20, yPosition);
  yPosition += 15;

  pdf.setFont('helvetica', 'normal');

  // Frekuensi Napas
  pdf.text(`Frekuensi Napas: ${ambulanceForm.data.frekuensiNafas || '_________/menit'}`, 20, yPosition);
  yPosition += 10;

  // Frekuensi Nadi
  pdf.text(`Frekuensi Nadi: ${ambulanceForm.data.frekuensiNadi || '_________/menit'}`, 20, yPosition);
  yPosition += 10;

  // Suhu
  pdf.text(`Suhu: ${ambulanceForm.data.suhu || 'Normal/Panas/Dingin'}`, 20, yPosition);
  yPosition += 10;

  // Kondisi Kulit
  pdf.text(`Kondisi Kulit: ${ambulanceForm.data.kondisiKulit || 'Lembab/Kering/Pucat/Normal/Kebiruan/Berkeringat'}`, 20, yPosition);
  yPosition += 20;

  // KETERANGAN
  pdf.setFont('helvetica', 'bold');
  pdf.text('KETERANGAN', 20, yPosition);
  yPosition += 15;

  pdf.setFont('helvetica', 'normal');

  // Perdarahan
  pdf.text(`: Perdarahan`, 20, yPosition);
  yPosition += 10;

  // Luka
  pdf.text(`: Luka`, 20, yPosition);
  yPosition += 10;

  // Patah Tulang
  pdf.text(`: Patah Tulang`, 20, yPosition);
  yPosition += 20;

  // KOMPAK
  pdf.setFont('helvetica', 'bold');
  pdf.text('KOMPAK:', 20, yPosition);
  yPosition += 15;

  pdf.setFont('helvetica', 'normal');

  // Keluhan Utama
  pdf.text(`Keluhan Utama: ${ambulanceForm.data.keluhan || '________________________________________________________________________________'}`, 20, yPosition);
  yPosition += 15;

  // Obat Terakhir
  pdf.text(`Obat Terakhir: ${ambulanceForm.data.obat || '________________________________________________________________________________'}`, 20, yPosition);
  yPosition += 15;

  // Makanan/Minuman Terakhir
  pdf.text(`Makanan/Minuman Terakhir: ${ambulanceForm.data.makanMinum || '________________________________________________________________________________'}`, 20, yPosition);
  yPosition += 15;

  // Penyakit yang diderita
  pdf.text(`Penyakit yang diderita: ${ambulanceForm.data.penyakit || '________________________________________________________________________________'}`, 20, yPosition);
  yPosition += 15;

  // Alergi yang diderita
  pdf.text(`Alergi yang diderita: ${ambulanceForm.data.alergi || '________________________________________________________________________________'}`, 20, yPosition);
  yPosition += 15;

  // Kejadian
  pdf.text(`Kejadian: ${ambulanceForm.data.kejadian || '________________________________________________________________________________'}`, 20, yPosition);
  yPosition += 20;

  // KETERANGAN
  pdf.setFont('helvetica', 'bold');
  pdf.text('KETERANGAN', 20, yPosition);
  yPosition += 15;

  pdf.setFont('helvetica', 'normal');

  // Dirujuk ke
  pdf.text(`Dirujuk ke: ${ambulanceForm.data.statusRujukan || 'Rumah Sakit/Puskesmas/Dokter/Lainnya.'}`, 20, yPosition);
  yPosition += 20;

  // Footer
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const location = ambulanceForm.data.lokasi || 'Ampel';
  const date = new Date().toLocaleDateString('id-ID');
  pdf.text(`${location}, ${date}`, 120, yPosition);

  yPosition += 15;

  // Petugas Penolong
  pdf.text('Petugas Penolong', 120, yPosition);
  yPosition += 15;

  pdf.text('(________________)', 120, yPosition);

  return pdf.output('arraybuffer');
};
