const { Client, Environment } = require("square");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid");
const juice = require("juice");
const { MongoClient } = require("mongodb");
const mongo = new MongoClient(process.env.MONGO);

const payments = new Client({
	environment: Environment[process.env.SQUARE_ENV],
	accessToken: process.env.SQUARE_KEY,
}).paymentsApi;

const mail = nodemailer.createTransport(
	sendgrid({
		apiKey: process.env.SENDGRID_KEY,
	})
);

exports.handler = async ({ body }) => {
	const { nonce, email, address, location, basket, total } = JSON.parse(body);

	return payments
		.createPayment({
			sourceId: nonce,
			amountMoney: {
				amount: total,
				currency: "GBP",
			},
			idempotencyKey: uuidv4(),
		})
		.then(() =>
			mongo.connect().then(() =>
				mongo
					.db("stores")
					.collection("order")
					.insertOne({
						email,
						basket,
						total,
						address,
						location,
						status: "new",
					})
					.then(r => r.insertedId, mongo.close())
			)
		)
		.then(id =>
			mail.sendMail({
				from: '"West Moors Stores" <contact@westmoorsstores.com>',
				bcc: "contact@westmoorsstores.com",
				to: email,
				subject: "Receipt",
				html: juice(`
				<meta name="color-scheme" content="light dark">
				<meta name="supported-color-schemes" content="light dark">
				<body>
					<table>
          	<tr>
							<td>Ref:</td>
							<td>${id}</td>
						</tr>
						<tr>
							<td>Total:</td>
							<td>&#163;${(total / 100).toFixed(2)}</td>
						</tr>
            <tr style="height: 24px"></tr>
						${basket
							.map(
								p => `
									<tr class="product">
										<td>
											<img src="${p.img}" style="height: 40px" />
										</td>
										<td>${p.name}</td>
										<td>
											&#163;${(p.price / 100).toFixed(2)} x ${p.qty}
										</td>
									</tr>
								`
							)
							.join("")}
					</table>
				</body>
				<style>
					body {
						font-family: "Helvetica, Arial", sans-serif;
						font-size: 16px;
					} 
	
					table {
						width: 100%;
						max-width: fit-content;
						text-indent: 0;
						border-color: inherit;
						border-collapse: collapse; 
					}
	
					.product:not(:first-child) {
						border-top: 1px solid #e6eeee;
					}
			
					td {
						padding: 6.4px;
					}
				</style>
			`),
			})
		)
		.then(() => ({ statusCode: 201 }))
		.catch(err => ({
			statusCode: 500,
			body: JSON.stringify(err),
		}));
};
