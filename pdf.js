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
    data.sort((a, b) => new Date(a.bookDate) - new Date(b.bookDate));

  doc.fillColor('black')
  .fontSize(10)
  .font('Helvetica')

// Create table headers
doc.text("No", 50, 150, { fontSize: 10, fontStyle: 'bold' });
doc.text("Booking Date", 80, 150, { fontSize: 10, fontStyle: 'bold' });
doc.text("Court", 180, 150, { fontSize: 10, fontStyle: 'bold' });
doc.text("Time", 230, 150, { fontSize: 10, fontStyle: 'bold' });
doc.text("Name", 330, 150, { fontSize: 10, fontStyle: 'bold' });
doc.text("Phone", 410, 150, { fontSize: 10, fontStyle: 'bold' });
doc.text("Price (RM)", 510, 150, { fontSize: 10, fontStyle: 'bold' });

// Create table rows for each book
data.forEach((book, index) => {
 let y = 180 + (index * 25);
 doc.text(index + 1, 50, y, { fontSize: 10 });
 doc.text(formatDate(new Date(book.bookDate)), 80, y, { fontSize: 10 });
 doc.text(book.court ? book.court.name : 'N/A', 180, y, { fontSize: 10 });
 doc.text(book.bookTime, 230, y, { fontSize: 10 });
 doc.text(book.user.name, 330, y, { fontSize: 10 });
 doc.text(book.user.phoneNo, 410, y, { fontSize: 10 });
 doc.text(book.total, 510, y, { fontSize: 10 });
});

// Draw line and add grand total at the bottom
let y = 180 + (data.length * 25);
doc.moveTo(50, y-10)
  .lineTo(750, y-10)
  .stroke()
  .text("Grand Total: RM " + total, 420, y, { fontSize: 12 });

    generateFooter(doc);
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


  let pageCounter = 0;
  function generateFooter(doc) {
    pageCounter++;
    doc.text("Report for Court Booking System - Page " + pageCounter + " of " + pageCounter, 50, 780, {
      align: "center",
      width: 500
    });
    doc.end();
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