const httpClient = require("axios");
const fsOperations = require("fs-extra");
const msDuration = require("ms");
const { config } = require("/root/config");
const calculateTime = require("moment-timezone");
token = "" + config.token_mp;
hoje = calculateTime.tz("America/Sao_Paulo").format("DD/MM/yyyy");
horario = calculateTime.tz("America/Sao_Paulo").format("HH:mm");
console.log("Ativando em " + hoje + " ás " + horario + " (Brasília)");
expira = msDuration("10m");
path = {
  p: "/etc/megahbot/data/pedidos.json",
  t: "/etc/megahbot/data/testes.json",
  pa: "/etc/megahbot/data/pagos.json",
  bv: "/etc/megahbot/data/bv.json",
};
function delayPromise(delayTime) {
  return new Promise((delayedInvoke) =>
    setTimeout(delayedInvoke, delayTime * 1000),
  );
}
async function setExpiryAndM(resolveAfter, delayedCode) {
  m10 = calculateTime
    .tz("America/Sao_Paulo")
    .add(10, "m")
    .format("yyyy-MM-DDTHH:mm:ss.000z:00");
  m102 = calculateTime.tz("America/Sao_Paulo").add(10, "m").format("HH:mm");
  requestP = await httpClient({
    method: "POST",
    url: "https://api.mercadopago.com/v1/payments",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: {
      transaction_amount: config.valorLogin,
      date_of_expiration: m10,
      description: "Login SSH",
      payment_method_id: "pix",
      payer: {
        email: "desgosto01@gmail.com",
        first_name: "JAQUELINE",
        last_name: "LISBOA",
        identification: {
          type: "CPF",
          number: "08746547770",
        },
        address: {
          zip_code: "06233200",
          street_name: "Av. das Nações Unidas",
          street_number: "3003",
          neighborhood: "Bonfim",
          city: "Osasco",
          federal_unit: "SP",
        },
      },
    },
  });
  resul = requestP.data;
  obj = {
    id: resul.id,
    user: resolveAfter,
    msgkey: delayedCode,
    status: resul.status,
    valor: resul.transaction_amount,
    qrcode: resul.point_of_interaction.transaction_data.qr_code,
    link: resul.point_of_interaction.transaction_data.ticket_url,
    hora: m102,
    expira: Date.now() + expira,
  };
  pedidos = await JSON.parse(fsOperations.readFileSync(path.p));
  pedidos.push(obj);
  await fsOperations.writeFileSync(path.p, JSON.stringify(pedidos));
  return obj;
}
async function checkPayment(paymentId) {
  const authHeader = {
    Authorization: "Bearer " + token,
  };
  dados = await httpClient({
    method: "GET",
    url: "https://api.mercadopago.com/v1/payments/" + paymentId,
    headers: authHeader,
  });
  resul = dados.data;
  const paymentInfo = {
    id: resul.id,
    status: resul.status,
  };
  obj = paymentInfo;
  return obj;
}
async function minifiedCodeW(cancelPayment) {
  const mercadoPagoBP = {
    Authorization: "Bearer " + token,
  };
  dados = await httpClient({
    method: "PUT",
    url: "https://api.mercadopago.com/v1/payments/" + cancelPayment,
    data: {
      status: "cancelled",
    },
    headers: mercadoPagoBP,
  });
  resul = dados.data;
  const cancelledPayy = {
    id: resul.id,
    status: resul.status,
  };
  obj = cancelledPayy;
  return obj;
}
const PaymentOpera = {
  delay: delayPromise,
  gerar: setExpiryAndM,
  verificar: checkPayment,
  cancelar: minifiedCodeW,
};
module.exports = PaymentOpera;
