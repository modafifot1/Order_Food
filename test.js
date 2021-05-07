const public_key =
  "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAohdHc1KjKfu+T6ABqGAhieGO9omjvspfz4FWY0dd55plrBdFQYuYubc43hOkNtRXFUsrxYKB3FiBot0T12bde8XMveQe/HzUkdc46d7SR7CQyANEQvKt2SRDTyeyQAW9XVnWw5CsK1zFCRCBNH3RsEcMfzWPneK1tKaA+4ilL7br/0Xr0ajtpdS9ySWJyVLZh3sj3hHpz9NE9SrtRA74N2UcHEaVKg6e34G/hZKaQW87yto6H/0jXx0oKZQ7/qQyKqxiNpdlWKHQgRTFr3R8L1S52ipJvjJ9oenVwxafRmQ4fp4UcOuleXblcSmK/d3Bj+2cBx4O9Z6B4Ic4dY2TSYgof/g0HvSIBTqOGug84cGxTsnoxVKv0RdLAp9lE29ZF+kRGDaoexLeJog/SLWOpgQWs2ZL/StCfdiLDaP52fMui8ePp92LeZlW0oAQtMeOu6YR5Yz0zsHP96eFHTABooXs3sbf0+5ADQwTAjtC5x9B+CuzFYF0Kg5BSWGQPEpV9Ta83eZ5cTXE4KuYRVupCi4UhFaq74u36wQucLMJhrg0GagFrfVwBYmDhMA2BNmp4+ORiSYdklSNFH2cXMJOSJhUL5KT8DmpzpZp5kmvPaXI5q0hHY2+lP5VtMWlp7vOOC4onbg1RuPv2YeBSXjcbp7ZEbbchv+8rKjRnTNtFncCAwEAAQ==";
const a =
  "A7WFmmnpn6TRX42Akh/iC5DdU5hhBT9LR5QSG6rJAl70hfEkkGUx2pTCai8s+M9KMVUcJ7m52iv74yhmeEjjN10TtEJoqITBIYBG2bqcTprhDijyhV4ePU7ytDNuLxzzIvGfTYyvbsEJ2jZTSf556yod12vhYqOJSFL/U2hVuxjUahf5Rnu5R/OLalg8QmlU6nQooEuNdzEXPMd6j9EaxOCiB2oM5/9QiTN0tCNSTIVvPtnlHu5mIbBHChcwfToIL4IAiD1nbrlDuBX//CZcrZj6hFqjvU31yb/DuG02c3aqWxbZKZ8csOwF9bL30m/yGr/0BQUWgunpDPrmCosf9A==";
console.log(a.length);
const NodeRSA = require("node-rsa");
// const key = new NodeRSA();
const data = {
  partnerCode: "MOMOIQA420180417",
  partnerRefId: "Merchant123556666",
  partnerTransId: "8374736463",
  amount: 40000,
  description: "Thanh toan momo",
};
// const rsa = require("crypto-js");

// // const hash = key.encrypt(data, "base64", public_key);
// const hash = rsa.DES.encrypt(JSON.stringify(data), public_key);
// console.log(hash);
const en = require("jsencrypt");
const jsen = new en();
