const {
  default: expressRouter,
  delay: setTimeout,
  DisconnectReason: DisconnectReh,
  BufferJSON: jsonToBuffer,
  useMultiFileAuthState: extendStateAg,
} = require("@whiskeysockets/baileys");
const { Boom: errorHandler } = require("@hapi/boom");
const Logger = require("pino");
const { exec: runShellCmd } = require("child_process");
const httpServerCre = require("express");
const { gerar: processWhatsM } = require("/etc/megahbot/src/gerar");
const expressApp = httpServerCre();
const DateFormatter = require("moment-timezone");
const expressServer = require("fs-extra");
const convertToTime = require("ms");
const msToDate = require("parse-ms");
const { config: whatsAppBotWh } = require("/root/config");
time = convertToTime("1d");
time2 = convertToTime("40m");
expiraZ = convertToTime("31d");
d31 = DateFormatter.tz("America/Sao_Paulo").add(31, "d").format("DD/MM/yyyy");
expressApp.listen(7000);
dono = [whatsAppBotWh.dono + "@s.whatsapp.net"];
dono2 = "" + whatsAppBotWh.dono;
path = {
  p: "/etc/megahbot/data/pedidos.json",
  t: "/etc/megahbot/data/testes.json",
  pa: "/etc/megahbot/data/pagos.json",
  bv: "/etc/megahbot/data/bv.json",
};
async function checkFileType(userId) {
  pedidos = await JSON.parse(expressServer.readFileSync(path.p));
  for (var itemCount = 0; itemCount < pedidos.length; itemCount++) {
    if (pedidos[itemCount].user == userId) {
      return true;
    }
  }
  return false;
}
async function testHasExpir(_userId) {
  testes = await JSON.parse(expressServer.readFileSync(path.t));
  testes = await JSON.parse(expressServer.readFileSync(path.t));
  for (var validateUserO = 0; validateUserO < testes.length; validateUserO++) {
    if (testes[validateUserO].user == _userId) {
      if (Date.now() < testes[validateUserO].expira) {
        return true;
      }
      if (Date.now() > testes[validateUserO].expira) {
        testes.splice(validateUserO, 1);
        await expressServer.writeFileSync(path.t, JSON.stringify(testes));
        return false;
      }
    }
  }
  return false;
}
async function isBVExpired(__userId) {
  bvtime = await JSON.parse(expressServer.readFileSync(path.bv));
  for (var filterExpired = 0; filterExpired < bvtime.length; filterExpired++) {
    if (bvtime[filterExpired].user == __userId) {
      if (Date.now() < bvtime[filterExpired].expira) {
        return true;
      }
      if (Date.now() > bvtime[filterExpired].expira) {
        bvtime.splice(filterExpired, 1);
        await expressServer.writeFileSync(path.bv, JSON.stringify(bvtime));
        return false;
      }
    }
  }
  return false;
}
async function addExpiringOb(___userId) {
  bvtime = await JSON.parse(expressServer.readFileSync(path.bv));
  obj = {
    user: ___userId,
    expira: Date.now() + time2,
  };
  bvtime.push(obj);
  await expressServer.writeFileSync(path.bv, JSON.stringify(bvtime));
}
async function updateTestExp(userID) {
  testes = await JSON.parse(expressServer.readFileSync(path.t));
  obj = {
    user: userID,
    expira: Date.now() + time,
  };
  testes.push(obj);
  await expressServer.writeFileSync(path.t, JSON.stringify(testes));
}
function randomLongUpU() {
  i = 10000000000000000000;
  return Math.floor(Math.random() * (i + 1));
}
function splitAtSymbol(inputString) {
  i = inputString.indexOf("@");
  return inputString.slice(0, i);
}
async function hasUserMadeAY(hasMadePay) {
  pagos = await JSON.parse(expressServer.readFileSync(path.pa));
  for (var loopForPayCom = 0; loopForPayCom < pagos.length; loopForPayCom++) {
    if (pagos[loopForPayCom].user == hasMadePay) {
      return true;
    }
  }
  return false;
}
async function _tempPaymentId(tempPaymentId) {
  pagos = await JSON.parse(expressServer.readFileSync(path.pa));
  for (var paymentLoginF = 0; paymentLoginF < pagos.length; paymentLoginF++) {
    if (pagos[paymentLoginF].user == tempPaymentId) {
      logins = pagos[paymentLoginF].logins;
      quanti = logins.length;
      tesk = "Você tem *" + quanti + "* login's Premium";
      for (
        var paymentLoginF = 0;
        paymentLoginF < logins.length;
        paymentLoginF++
      ) {
        usu = logins[paymentLoginF].usuario;
        sen = logins[paymentLoginF].senha;
        limi = logins[paymentLoginF].limite;
        vali = logins[paymentLoginF].Validade;
        exp = msToDate(logins[paymentLoginF].expira - Date.now());
        exp = exp.days + " dias";
        exps = logins[paymentLoginF].expira;
        if (Date.now() > exp) {
          exp = "venceu";
        }
        tesk =
          tesk +
          ("\n\n*👤Usuário:* " +
            usu +
            "\n*🔐Senha:* " +
            sen +
            "\n*📲Limite:* " +
            limi +
            "\n*⌛Validade:* " +
            vali +
            " (" +
            exp +
            ")\n\n===============");
      }
      return tesk;
    }
  }
  return "Você não tem logins Premium";
}
async function whatsAppLogin() {
  const { state: _whatsAppLogin, saveCreds: saveWhatsAppT } =
    await extendStateAg("/etc/megahbot/login");
  const ConfiguredApp = await expressRouter({
    logger: Logger({
      level: "silent",
    }),
    printQRInTerminal: true,
    auth: _whatsAppLogin,
    keepAliveIntervalMs: 16000,
  });
  ConfiguredApp.ev.on("creds.update", saveWhatsAppT);
  ConfiguredApp.ev.on("connection.update", async (ConnectionMon) => {
    const { connection: connectionPin, lastDisconnect: lastDisconnDt } =
      ConnectionMon;
    if (connectionPin == "connecting") {
      console.log("Conectando...");
    }
    if (connectionPin === "close") {
      console.log(DisconnectReh);
      console.log("Conexão fechada por: ", lastDisconnDt, ", Reconectando...");
      await setTimeout(3000);
      whatsAppLogin();
    } else if (connectionPin === "open") {
      console.log("CONECTADO COM SUCESSO!");
      console.log("#######################");
      console.log(
        "Caso você tenha lido o qrcode agora, espere 10 segundos e depois dê um CTRL+c",
      );
      console.log("#######################");
    }
  });
  console.log("Abrindo navegador...");
  expressApp.get("/pago", async (queryParams, jsonResponse) => {
    try {
      var { user: userPart } = queryParams.query;
      var { id: getIdFromUrl } = queryParams.query;
      console.log(userPart, getIdFromUrl);
      if (!userPart.includes("@s")) {
        return jsonResponse.json({
          msg: "bad request",
        });
      }
      pagtoC = await ConfiguredApp.sendMessage(userPart, {
        text: "Pagamento id: " + getIdFromUrl + " confirmado!",
      }).catch((createExpress) => {
        console.log("deu erro");
        console.log(createExpress);
        jsonResponse.json({
          msg: "error",
        });
      });
      usuarioV = "user" + ("" + randomLongUpU()).slice(0, 4);
      senha = ("" + randomLongUpU()).slice(0, 4);
      runShellCmd("sh /etc/megahbot/src/user.sh " + usuarioV + " " + senha);
      const createLoginIn = {
        text:
          "*•Informações do login•*\n\n*👤Usuário:* " +
          usuarioV +
          "\n*🔐Senha:* " +
          senha +
          "\n*📲Limite:* 1\n*⌛Validade:* " +
          d31 +
          " (31 dias)",
      };
      const paymentConfir = {
        quoted: pagtoC,
      };
      await ConfiguredApp.sendMessage(
        userPart,
        createLoginIn,
        paymentConfir,
      ).catch((logErrorAndRe) => {
        console.log("deu erro");
        console.log(logErrorAndRe);
        jsonResponse.json({
          msg: "error",
        });
      });
      console.log(userPart);
      if (await hasUserMadeAY(userPart)) {
        pagos = await JSON.parse(expressServer.readFileSync(path.pa));
        obj = {
          usuario: usuarioV,
          senha: senha,
          limite: 1,
          Validade: d31,
          expira: Date.now() + expiraZ,
        };
        for (
          var transactionId = 0;
          transactionId < pagos.length;
          transactionId++
        ) {
          if (pagos[transactionId].user == userPart) {
            pagos[transactionId].logins.push(obj);
            await expressServer.writeFileSync(path.pa, JSON.stringify(pagos));
          }
        }
      } else {
        pagos = await JSON.parse(expressServer.readFileSync(path.pa));
        obj = {
          user: userPart,
          logins: [
            {
              usuario: usuarioV,
              senha: senha,
              limite: 1,
              Validade: d31,
              expira: Date.now() + expiraZ,
            },
          ],
        };
        pagos.push(obj);
        await expressServer.writeFileSync(path.pa, JSON.stringify(pagos));
      }
      jsonResponse.json({
        msg: "sucess",
      });
    } catch (_errorHandler) {
      console.log(_errorHandler);
      console.log("deu erro");
    }
  });
  ConfiguredApp.ev.on("messages.upsert", async (fetchFirstNon) => {
    ConfiguredApp.sendPresenceUpdate("available");
    message = fetchFirstNon.messages[0];
    msg = message.message;
    if (!msg) {
      return;
    }
    key = message.key;
    fromMe = key.fromMe;
    if (key.remoteJid == "status@broadcast") {
      return;
    }
    if (fromMe) {
      return;
    }
    from = key.remoteJid;
    isGroup = from.includes("@g.us");
    if (isGroup) {
      jid = key.participant;
    } else {
      jid = from;
    }
    if (isGroup) {
      return;
    }
    console.log("$$$$$$$$$$$$$");
    galo = Object.keys(msg);
    if (galo.includes("conversation")) {
      body = msg.conversation;
    } else if (galo.includes("extendedTextMessage")) {
      body = msg.extendedTextMessage.text;
    } else {
      body = "midia";
    }
    body = body.toLowerCase();
    async function sendFormatted(messageBuffer) {
      const formattedMsg = {
        text: messageBuffer,
      };
      const _formattedMsg = {
        quoted: message,
      };
      await ConfiguredApp.sendMessage(from, formattedMsg, _formattedMsg);
    }
    async function sendMessageTo(inputData, messageToUser) {
      const message = {
        text: messageToUser,
      };
      await ConfiguredApp.sendMessage(inputData, message);
    }
    if (!isGroup) {
      console.log(
        "\n\nMensagem no privado de " +
          splitAtSymbol(jid) +
          "\n\nMensagem: " +
          body +
          "\n\n############",
      );
    }
    ConfiguredApp.sendPresenceUpdate("available", jid);
    ConfiguredApp.readMessages([key]);
    if (isGroup) {
      return;
    }
    switch (body) {
      case "1":
      case "01":
        if (await testHasExpir(jid)) {
          return sendFormatted(
            "Você já gerou um teste hoje, só poderá gerar outro em 24h",
          );
        }
        usuarioT = "teste" + ("" + randomLongUpU()).slice(0, 4);
        runShellCmd(
          "sh /etc/megahbot/src/teste.sh " +
            usuarioT +
            " " +
            whatsAppBotWh.tempo_teste * 60,
        );
        const IABotGermanEn = {
          text:
            "*•Informações do login•*\n\n*👤Usuário:* " +
            usuarioT +
            "\n*🔐Senha:* 1234\n*📲Limite:* 1\n*⌛Validade:* " +
            whatsAppBotWh.tempo_teste +
            "h",
        };
        const previousInter = {
          quoted: message,
        };
        tesy = await ConfiguredApp.sendMessage(
          jid,
          IABotGermanEn,
          previousInter,
        );
        const tesyMessage = {
          quoted: tesy,
        };
        await ConfiguredApp.sendMessage(
          jid,
          {
            text: "Aproveite bem seu teste 🔥",
          },
          tesyMessage,
        );
        await setTimeout(500);
        updateTestExp(jid);
        break;
      case "2":
      case "02":
        placa2 =
          "*•Informações do produto•*\n\n*🏷️Valor:* R$" +
          whatsAppBotWh.valorLogin +
          "\n*📲Limite:* 1\n*⌛Validade:* 30 dias\n\n📌Sempre faça um teste antes de comprar!\nPara obter o app, digite o comando abaixo ⤵️\n\n/app\n\nDeseja comprar? *Sim* ou *Não*";
        sendFormatted(placa2);
        break;
      case "sim":
      case "si":
      case "ss":
      case "s":
        if (await checkFileType(jid)) {
          return sendFormatted(
            "Você tem um pedido em andamento, pague ou espere ele expirar para fazer outro pedido",
          );
        }
        sendFormatted("Gerando Qrcode...");
        dados = await processWhatsM(jid, message);
        placa =
          "*Informações do Qrcode:*\n\n🆔Id: " +
          dados.id +
          "\n🏷️Valor: R$" +
          dados.valor +
          "\n⌛Expira em: 10 min\nàs *" +
          dados.hora +
          "* _(horário de Brasília)_\n\n📌Seu login será enviado assim que seu pagamento for identificado, pode demorar cerca de 1 minuto.\n\n_Qrcode copia e cola logo abaixo_ ⤵️";
        const testSessionId = {
          text: placa,
        };
        mcode = await ConfiguredApp.sendMessage(dados.user, testSessionId, {
          quoted: dados.msgkey,
        });
        const DailyTestRepe = {
          quoted: mcode,
        };
        await ConfiguredApp.sendMessage(
          dados.user,
          {
            text: dados.qrcode,
          },
          DailyTestRepe,
        );
        break;
      case "nao":
      case "não":
      case "no":
      case "n":
      case "nn":
        sendFormatted("Tudo certo! Se precisar é só me chamar! 😉");
        break;
      case "5":
      case "05":
        const expressAppSni = {
          text: "*☎️Suporte*\n\n🆔@" + dono2,
          mentions: dono,
        };
        const generateTeste = {
          quoted: message,
        };
        await ConfiguredApp.sendMessage(jid, expressAppSni, generateTeste);
        break;
      case "3":
      case "03":
        gama = await _tempPaymentId(jid);
        const isEligibleFor = {
          text: gama,
        };
        const _private = {
          quoted: message,
        };
        await ConfiguredApp.sendMessage(jid, isEligibleFor, _private);
        break;
      case "/app":
      case "app":
      case "4":
      case "04":
        sendFormatted("Aguarde...");
        const userDetails = {
          text:
            "Faça o download do app através do link abaixo⤵️\n\n" +
            whatsAppBotWh.linkApp +
            "\n\n📌Caso o link não esteja clicável, salve meu contato que ele ficará",
        };
        const errorMessage = {
          quoted: message,
        };
        await ConfiguredApp.sendMessage(jid, userDetails, errorMessage);
        break;
      case "/menu":
      case "menu":
        boasvindas =
          "Seja Bem vindo(a) a *" +
          whatsAppBotWh.nomeLoja +
          "!* Fique a vontade para escolher alguma das opções abaixo:\n\n*[01]* Gerar teste ⌛\n*[02]* Comprar login 30 dias 📆\n*[03]* Verificar Logins 🔍\n*[04]* Aplicativo 📱\n*[05]* Suporte 👤";
        sendFormatted(boasvindas);
        break;
      default:
        if (await isBVExpired(jid)) {
          return;
        }
        boasvindas =
          "Seja Bem vindo(a) a *" +
          whatsAppBotWh.nomeLoja +
          "!* Fique a vontade para escolher alguma das opções abaixo:\n\n*[01]* Gerar teste ⌛\n*[02]* Comprar login 30 dias 📆\n*[03]* Verificar Logins 🔍\n*[04]* Aplicativo 📱\n*[05]* Suporte 👤";
        const startOrInform = {
          text: boasvindas,
        };
        const validateUser = {
          quoted: message,
        };
        tagbv = await ConfiguredApp.sendMessage(
          jid,
          startOrInform,
          validateUser,
        );
        const dataStore = {
          quoted: tagbv,
        };
        await ConfiguredApp.sendMessage(
          jid,
          {
            text: "Para ver está mensagem novamente, digite:\n\n*/menu*",
          },
          dataStore,
        );
        await setTimeout(500);
        addExpiringOb(jid);
    }
  });
}
whatsAppLogin();
const { checkStatus: isAvailableJD } = require("/etc/megahbot/src/veri");
