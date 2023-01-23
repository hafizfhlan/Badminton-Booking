const {
  courtInfo
} = require("./models/court");
const {
  CustomerInfo
} = require("./models/customer_info");
const {
  bookInfo
} = require("./models/book_info");
const {
  default: mongoose
} = require("mongoose");

PDFDocument = require('pdfkit');
const fs = require('fs');



function buildPDF(dataCallback, endCallback) {

  bookInfo.find().populate({
    path: "user",
    select: {
      'password': 0
    }
  }).populate({
    path: "court"
  }).exec().then((data) => {
    var doc = new PDFDocument({
      size: "A4",
      margin: 50
    });
    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    generateHeader(doc);
    let total = data.reduce((acc, book) => acc + book.total, 0);

    doc
      .fillColor('black')
      .fontSize(12)
      .text('No', 50, 150)
      .text('Booking Date', 80, 150)
      .text('Court', 180, 150)
      .text('Time', 230, 150)
      .text('Name', 330, 150)
      .text('Phone', 410, 150)
      .text('Price (RM)', 510, 150)

    data.forEach(book => {
      for (let i = 0; i < data.length; i++) {
        let book = data[i];
        let y = 180 + (i * 30);
        doc
          .text(i + 1, 50, y)
          .text(formatDate(new Date(book.bookDate)), 80, y)
          .text(book.court.name, 180, y)
          .text(book.bookTime, 230, y)
          .text(book.user.name, 330, y)
          .text(book.user.phoneNo, 410, y)
          .text(book.total, 510, y)
      }
      let y = 180 + (data.length * 30);
doc
  .moveTo(50, y-10)
  .lineTo(550, y-10)
  .stroke()
  .text("Grand Total: RM " + total, 420, y)

    });
    // generateInvoiceTable(doc, dataCallback);
    generateFooter(doc);




    doc.end();
  })



  function generateHeader(doc) {
    doc
      .image("asset/img/apple-touch-icon.png", 50, 45, {
        width: 50
      })
      .fillColor("#444444")
      .fontSize(20)
      .text("Court Booking Report.", 110, 57)
      .fontSize(10)
      .text("ACME Inc.", 200, 50, {
        align: "right"
      })
      .text("123 Main Street", 200, 65, {
        align: "right"
      })
      .text("New York, NY, 10025", 200, 80, {
        align: "right"
      })
      .moveDown();
  }

  function generateInvoiceTable(doc, dataCallback) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      invoiceTableTop,
      "Name",
      "Court",
      "Time",
      "Date",
      "Price (RM)"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");
  }

  function generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        "Report for Court Booking System",
        50,
        780, {
          align: "center",
          width: 500
        }
      );
  }

  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
  }


  //   function generateTableRow(
  //     doc,
  //     y,
  //     name,
  //     court,
  //     time,
  //     date,
  //     price   
  //   ) {
  //     doc
  //       .fontSize(10)
  //       .text(name, 50, y)
  //       .text(court, 150, y)
  //       .text(time, 280, y, { width: 90, align: "right" })
  //       .text(date, 370, y, { width: 90, align: "right" })
  //       .text(price, 0, y, { align: "right" });
  //   }

  //   function generateHr(doc, y) {
  //     doc
  //       .strokeColor("#aaaaaa")
  //       .lineWidth(1)
  //       .moveTo(50, y)
  //       .lineTo(550, y)
  //       .stroke();
  //   }
}

module.exports = {
  buildPDF
};