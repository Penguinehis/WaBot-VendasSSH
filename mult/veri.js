const httpRequest = require("axios");
const FileSystem = require("fs-extra");
const {
  gerar: generateTestT,
  verificar: fetchDataVerb,
  cancelar: stopTask,
} = require("/etc/megahbot/src/gerar");
const { delay: waitWithDelay } = require("@whiskeysockets/baileys");
path = {
  p: "/etc/megahbot/data/pedidos.json",
  t: "/etc/megahbot/data/testes.json",
  pa: "/etc/megahbot/data/pagos.json",
  bv: "/etc/megahbot/data/bv.json",
};
async function validateAndIn() {
  try {
    pedidos = await JSON.parse(FileSystem.readFileSync(path.p));
    for (var index = 0; index < pedidos.length; index++) {
      pedidos = await JSON.parse(FileSystem.readFileSync(path.p));
      status = await fetchDataVerb(pedidos[index].id);
      if (status.status == "approved") {
        console.log("Enviando login id " + status.id);
        env = await httpRequest(
          "http://localhost:7000/pago?user=" +
            pedidos[index].user +
            "&id=" +
            pedidos[index].id,
        );
        console.log(env.data);
        if (env.data.msg == "sucess") {
          pedidos.splice(index, 1);
          await FileSystem.writeFileSync(path.p, JSON.stringify(pedidos));
        } else {
          console.log("Erro ao enviar id " + status.id);
        }
      }
      if (
        (pedidos.length > 0 && Date.now() > pedidos[index].expira) ||
        status.status == "cancelled"
      ) {
        console.log("Expirou, removendo id: " + status.id);
        pedidos.splice(index, 1);
        await FileSystem.writeFileSync(path.p, JSON.stringify(pedidos));
        console.log("Removido com sucesso! " + status.id);
      }
      await waitWithDelay(500);
    }
    await waitWithDelay(10000);
    validateAndIn();
    console.log("Verificando pagamentos...");
  } catch (asyncError) {
    console.log(asyncError);
    validateAndIn();
  }
}
async function waitAndValidP() {
  await waitWithDelay(10000);
  console.log("Iniciando verificação de pagamentos...");
  validateAndIn();
}
waitAndValidP();
const statusChecker = {
  checkStatus: validateAndIn,
};
module.exports = statusChecker;
