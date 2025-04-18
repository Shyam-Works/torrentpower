import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { name, email, store, orderNo, formData, engineer, vender } = req.body;


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Create table rows grouped by category
  const itemTable = Object.entries(formData)
    .map(([category, items]) => {
      const itemEntries = Object.values(items)
        .filter((item) => item.quantity && item.quantity !== 0);

      if (itemEntries.length === 0) return '';

      return `
        ${itemEntries.map((item) => `
          <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td align="center">${item.quantity}</td>
          </tr>
        `).join('')}
      `;
    })
    .filter((row) => row !== '')
    .join('');

  // Fetch the list of emails from the .env variable and split them into an array
  //const recipients = process.env.EMAIL_TO.split(','); // now sending email to Recipient Email for verify

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,  // Using the array of emails here
    subject: `New Order from ${name}`,
    html: `
    
  <p><strong>Recipient Name:</strong> ${name}</p>
  <p><strong>Store Location:</strong> ${store}</p>
  <p><strong>Engineer:</strong> ${engineer}</p>
  <p><strong>Vender:</strong> ${vender}</p>
  ${orderNo ? `<p><strong>Order Number:</strong> ${orderNo}</p>` : ""}
  
  <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="background-color: #e9c46a;">
        <th>ID</th>
        <th>Item</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      ${itemTable}
    </tbody>
  </table>


    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent!");
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).send("Error sending email.");
  }
}
