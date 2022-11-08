import "./css/index.css"
import IMask from "imask"

//mexendo nas CORES do cartão:
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path") //pegue (no HTML) a div cc.bg,no svg eu quero o primeiro nível do g, dois dois que existem eu quero o primeiro e imprimir no console o path.
//console.log(ccBgColor01)
ccBgColor01.setAttribute("fill", "black") //dois argumentos, o primeiro é o local, o segundo é o atributo que eu quero.
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
ccBgColor02.setAttribute("fill", "gray")

//mexendo na LOGO do cartão:
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

//cores para cada BANDEIRA de cartão inserido. (vai ser passado para a função abaixo)
//const colors = {
//visa: ["#2D57F2", "#436D99"],
//mastercard: ["DF6F29", "#C69347"],
//default: ["purple", "orange"],
//}

//função para BANDEIRA de Cartão.
function setCardType(type) {
  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#C69347", "#DF6F29"],
    default: ["purple", "blue"],
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType
//mexendo no CVC (security code) com o IMask:
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

//mexendo na Expiração (expiration date) com o IMask:
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

//mexendo no NÚMERO do cartão com o IMask e regex:
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//Funções de CLICKS e EVENTOS dos cartões via DOM:

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert()
}) //click do botão

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
}) //desativa o reload do submit

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value //if ternário (são três 'senão/comportamento')
})

//Funções de CLICKS e EVENTOS dos cartões via Imask:
securityCodeMasked.on("accept", () => {
  uptadeSecurityCode(securityCodeMasked.value)
}) //mesma logica do eventListener (observa o conteúdo do input)

function uptadeSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")

  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
