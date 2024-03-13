// prettier-ignore

import { BaseTranslation } from "../i18n-types";

const en: BaseTranslation = {
  GaloyAddressScreen: {
    title: "Receive payment by using:",
    buttonTitle: "Set your {bankName: string} address",
    yourAddress: "Your {bankName: string} address",
    notAbleToChange:
      "You won't be able to change your {bankName: string} address after it's set.",
    addressNotAvailable: "This {bankName: string} address is already taken.",
    somethingWentWrong: "Something went wrong. Please try again later.",
    merchantTitle: "For merchants",
    yourCashRegister: "Your Lightning Cash Register",
    yourPaycode: "Your Paycode",
    copiedAddressToClipboard: "Copied {bankName: string} address to clipboard",
    copiedPaycodeToClipboard: "Copied Paycode to clipboard",
    copiedCashRegisterLinkToClipboard: "Copied Cash Register Link to clipboard",
    howToUseIt: "How to use it?",
    howToUseYourAddress: "How to use a Lightning address",
    howToUseYourPaycode: "How to use your Paycode",
    howToUseYourCashRegister: "How to use your Cash Register",
    howToUseYourAddressExplainer:
      "Share with someone that has a compatible wallet, such as:",
    howToUseYourPaycodeExplainer:
      "You can print your Paycode (which is an amountless invoice) and display it in your business to receive payments. Individuals can pay you by scanning it with a Lightning-enabled wallet.\n\nHowever, be aware that some wallets can’t scan an amountless invoice such as:",
    howToUseYourCashRegisterExplainer:
      "Allow people to collect payments via the Cash Register link, without accessing your wallet. They can create invoices and payments will be sent directly to your {bankName: string} Wallet.",
  },
  AuthenticationScreen: {
    authenticationDescription: "Authenticate to continue",
    setUp: "Set up Biometric Authentication",
    setUpAuthenticationDescription: "Use biometric to authenticate",
    skip: "Skip",
    unlock: "Unlock",
    usePin: "Use PIN",
  },
  BalanceHeader: {
    currentBalance: "Current Balance",
    hiddenBalanceToolTip: "Tap to reveal your balance",
  },
  ContactsScreen: {
    noContactsTitle: "No Contacts Found",
    noContactsYet:
      "Send or receive a payment using a username and contacts will automatically be added here",
    noMatchingContacts: "No contacts matching your search were found.",
    title: "Contacts",
  },
  ContactDetailsScreen: {
    title: "Transactions with {username: string}",
  },
  ConversionDetailsScreen: {
    title: "Convert",
    percentageToConvert: "% to convert",
  },
  ConversionConfirmationScreen: {
    title: "Review conversion",
    youreConverting: "You're converting",
    receivingAccount: "Receiving account",
  },
  ConversionSuccessScreen: {
    title: "Conversion Success",
    message: "Conversion successful",
  },
  EarnScreen: {
    earnSats: "Earn {formattedNumber|sats}",
    earnSections: {
      bitcoinWhatIsIt: {
        title: "Bitcoin: What is it?",
        questions: {
          whatIsBitcoin: {
            answers: [
              "Digital money",
              "A video game",
              "A new cartoon character",
            ],
            feedback: [
              "Correct. You just earned 1 “sat”!",
              "Incorrect, please try again.",
              "Nope. At least not one that we know of!",
            ],
            question: "So what exactly is Bitcoin?",
            text:
              "Bitcoin is digital money. \n\nIt can be transferred instantly and securely between any two people in the world — without the need for a bank or any other financial company in the middle.",
            title: "So what exactly is Bitcoin?",
          },
          sat: {
            answers: [
              "The smallest unit of Bitcoin",
              "A small satellite",
              "A space cat 🐱🚀",
            ],
            feedback: [
              "Correct. You just earned another two sats!!",
              "Maybe… but that is not the correct answer in this context 🙂",
              "Ummm.... not quite!",
            ],
            question: 'I just earned a “Sat". What is that?',
            text:
              "One “Sat” is the smallest unit of a bitcoin. \n\nWe all know that one US Dollar can be divided into 100 cents. Similarly, one Bitcoin can be divided into 100,000,000 sats. \n\nIn fact, you do not need to own one whole bitcoin in order to use it. You can use bitcoin whether you have 20 sats, 3000 sats — or 100,000,000 sats (which you now know is equal to one bitcoin).",
            title: 'I just earned a “Sat". What is that?',
          },
          whereBitcoinExist: {
            answers: [
              "On the Internet",
              "On the moon",
              "In a Federal bank account",
            ],
            feedback: [
              "Correct. You just earned another 5 sats.",
              "Incorrect. Well… at least not yet ;)",
              "Wrong. Please try again.",
            ],
            question: "Where do the bitcoins exist?",
            text:
              "Bitcoin is a new form of money. It can be used by anyone, anytime -- anywhere in the world. \n\nIt is not tied to a specific government or region (like US Dollars). There are also no paper bills, metal coins or plastic cards. \n\nEverything is 100% digital. Bitcoin is a network of computers running on the internet. \n\nYour bitcoin is easily managed with software on your smartphone or computer!",
            title: "Where do the bitcoins exist?",
          },
          whoControlsBitcoin: {
            answers: [
              "A voluntary community of users around the world",
              "Mr Burns from The Simpsons",
              "The government of France",
            ],
            feedback: [
              "That is right. Bitcoin is made possible by people all around the world running bitcoin software on their computers and smartphones.",
              "An amusing thought — but not correct!",
              "Wrong. There is no company nor government that controls Bitcoin.",
            ],
            question: "Who controls Bitcoin?",
            text:
              "Bitcoin is not controlled by any person, company or government. \n\nIt is run by the community of users -- people and companies all around the world -- voluntarily running bitcoin software on their computers and smartphones.",
            title: "Who controls Bitcoin?",
          },
          copyBitcoin: {
            answers: [
              "No — it is impossible to copy or duplicate the value of bitcoin",
              "Yes, you can copy bitcoins just as easily as copying a digital photo",
              "Yes, but copying bitcoin requires very specialized computers",
            ],
            feedback: [
              "That is absolutely correct!",
              "You know that it is not true. Try again.",
              "Incorrect. There is no way for anyone to copy, or create a duplicate, of bitcoin.",
            ],
            question:
              "If Bitcoin is digital money, can’t someone just copy it — and create free money?",
            text:
              "The value of a bitcoin can never be copied. This is the very reason why Bitcoin is such a powerful new invention!!\n\nMost digital files — such as an iPhone photo, an MP3 song, or a Microsoft Word document — can easily be duplicated and shared. \n\nThe Bitcoin software uniquely prevents the duplication — or “double spending” — of digital money. We will share exactly how this works later on!",
            title:
              "If Bitcoin is digital money, can’t someone just copy it — and create free money?",
          },
        },
      },
      WhatIsMoney: {
        title: "What is Money? ",
        questions: {
          moneySocialAggrement: {
            answers: [
              "Because people trust that other people will value money similarly",
              "Because your mother told you so",
              "Because a dollar bill is worth its weight in gold",
            ],
            feedback: [
              "Correct. This is what allows money to work!",
              "She may well have. But that is not the correct answer here!",
              "Nope. In the past you could exchange US dollars for gold. But this is no longer the case.",
            ],
            question: "Why does money have value?",
            text:
              "Money requires people to trust. \n\nPeople trust the paper dollar bills in their pocket. They trust the digits in their online bank account. They trust the balance on a store gift card will be redeemable. \n\nHaving money allows people to easy trade it immediately for a good, or a service.",
            title: "Money is a social agreement.",
          },
          coincidenceOfWants: {
            answers: [
              "Coincidence of wants",
              "Coincidence of day and night",
              "Coincidence of the moon blocking the sun",
            ],
            feedback: [
              "That is right. Money allows you to easily purchase something, without haggling about the form of payment",
              "No silly, you know that is not the answer.",
              "Not quite. We call that a solar eclipse 🌚",
            ],
            question: "Which coincidence does money solve?",
            text:
              "Centuries ago, before people had money, they would barter -- or haggle over how to trade one unique item, in exchange for another item or service. \n\nLet’s say you wanted to have a meal at the local restaurant, and offered the owner a broom. The owner might say “no” -- but I will accept three hats instead, if you happen to have them. \n\nYou can imagine how difficult and inefficient a “barter economy” would be !  \n\nBy contrast, with money, you can simply present a $20 bill. And you know that the restaurant owner will readily accept it.",
            title: "Money solves the “coincidence of wants”...  What is that??",
          },
          moneyEvolution: {
            answers: [
              "Stones, seashells and gold",
              "Tiny plastic Monopoly board game houses",
              "Coins made of chocolate",
            ],
            feedback: [
              "Correct. Items that are rare and difficult to copy have often been used as money.",
              "Wrong. They may have value when playing a game -- but not in the real word!",
              "Nope. They may be tasty. But they are not useful as money.",
            ],
            question:
              "What are some items that have been historically used as a unit of money?",
            text:
              "Thousands of years ago, society in Micronesia used very large and scarce stones as a form of agreed currency. \n\nStarting in the 1500’s, rare Cowrie shells (found in the ocean) became commonly used in many nations as a form of money.\n\nAnd for millennia, gold has been used as a form of money for countries around the world -- including the United States (until 1971).",
            title: "Money has evolved, since almost the beginning of time.",
          },
          whyStonesShellGold: {
            answers: [
              "Because they have key characteristics -- such as being durable, uniform and divisible.",
              "Because they are pretty and shiny.",
              "Because they fit inside of your pocket",
            ],
            feedback: [
              "Correct. More key characteristics include being scarce and portable.",
              "Incorrect. That may be true, but alone are not great characteristics of money.",
              "Not quite. Although these items were surely portable, that alone was not the reason to be used as money.",
            ],
            question:
              "Why were stones, seashells and gold used as units of money?",
            text:
              "Well, these items all had some -- but not all -- of the characteristics of good money. \n\nSo what characteristics make for “good” money? \nScarce: not abundant, nor easy to reproduce or copy \nAccepted: relatively easy for people to verify its authenticity \nDurable: easy to maintain, and does not perish or fall apart\nUniform: readily interchangeable with another item of the same form\nPortable: easy to transport\nDivisible: can be split and shared in smaller pieces",
            title:
              "Why were stones, shells and gold commonly used as money in the past?",
          },
          moneyIsImportant: {
            answers: [
              "Money allows people to buy goods and services today -- and tomorrow.",
              "Money allows you to go to the moon.",
              "Money is the solution to all problems.",
            ],
            feedback: [
              "That is right!",
              "Incorrect. Although that may change in the future ;)",
              "Not quite. Although some people may believe such, this answer does not address the primary purpose of money.",
            ],
            question: "What is the primary reason money is important?",
            text:
              "Everybody knows that money matters.\n\nMost people exchange their time and energy -- in the form of work -- to obtain money. People do so, to be able to buy goods and services today -- and in the future.",
            title: "Money is important to individuals",
          },
          moneyImportantGovernement: {
            answers: [
              "The US Central Bank (The Federal Reserve)",
              "Mr Burns from The Simpsons",
              "A guy with a printing press in his basement",
            ],
            feedback: [
              "Correct. The US Government can print as much money as they want at any time.",
              "Incorrect. Although it did seem like he always had a lot of money.",
              "No. Whilst some people do create fake dollar bills, it is definitely not legal!",
            ],
            question: "Who can legally print US Dollars, anytime they wish?",
            text:
              "Modern-day economies are organized by nation-states: USA, Japan, Switzerland, Brazil, Norway, China, etc. \n\nAccordingly, in most every nation, the government holds the power to issue and control money. \n\nIn the United States, the Central Bank (known as the Federal Reserve, or “Fed”) can print, or create, more US Dollars at any time it wants. \n\nThe “Fed” does not need permission from the President, nor Congress, and certainly not from US citizens.  \n\nImagine if you had the ability to print US Dollars anytime you wanted to -- what would you do??",
            title: "Money is also important to governments",
          },
        },
      },
      HowDoesMoneyWork: {
        title: "How Does Money Work? ",
        questions: {
          WhatIsFiat: {
            answers: [
              "It is created by order of the National government in a given country.",
              "By the manager of the local branch bank.",
              "The Monopoly Money Man.",
            ],
            feedback: [
              "Correct. The central bank of a government creates fiat money.",
              "Incorrect. A local bank can only manage money that has been previously created by the government.",
              "Nope. Try again!",
            ],
            question:
              "Who creates fiat money, such as US Dollars or Swiss Francs?",
            text:
              "All national currencies in circulation today are called “fiat” money. This includes US Dollars, Japanese Yen, Swiss Francs, and so forth. \n\nThe word “fiat” is latin for “by decree” -- which means “by official order”. \n\nThis means that all fiat money -- including the US Dollar -- is simply created by the order of the national government.",
            title: "Fiat Currency: What is that?",
          },
          whyCareAboutFiatMoney: {
            answers: [
              "All fiat currency is eventually abused by government authorities.",
              "Local banks might not have enough vault space to hold all of the dollar bills.",
              "There might not be enough trees to make paper for all of the additional dollar bills.",
            ],
            feedback: [
              "Correct. Throughout history, governments have been unable to resist the ability to print money, as they effectively have no obligation to repay this money.",
              "Nope, that is certainly not the case.",
              "Wrong. Please try again.",
            ],
            question:
              "Why should I care about the government controlling fiat money?",
            text:
              "As shared in a prior quiz, the US Central Bank is the Federal Reserve, or the “Fed”.\n\nThe Fed can print more dollars at any time -- and does not need permission from the President, nor Congress, and certainly not from US citizens.  \n\nHaving control of money can be very tempting for authorities to abuse -- and often time leads to massive inflation, arbitrary confiscation and corruption. \n\nIn fact, Alan Greenspan, the famous former chairman of The Fed, famously said the US “can pay any debt that it has, because we can always print more to do that”.",
            title:
              "I trust my government. \nWhy should I care about fiat money?",
          },
          GovernementCanPrintMoney: {
            answers: [
              "The printing of additional money leads to inflation.",
              "People must exchange old dollar bills at the bank every year.",
              "The appearance of the dollar bill changes.",
            ],
            feedback: [
              "Correct. This means that goods and services will cost more in the future.",
              "Nope. Older dollar bills are just as valid as newer ones.",
              "Incorrect. Although the government may issue new looks for bills, this has nothing to do with increasing the money supply.",
            ],
            question: "What does it mean when the government prints money?",
            text:
              "Well, everybody should care! \n\nThe practice of government printing money -- or increasing the supply of dollars -- leads to inflation.\n\nInflation is an increase in the price of goods and services. In other words, the price for something in the future will be more expensive than today.\n\nSo what does inflation mean for citizens? \n\nIn the United Kingdom, the Pound Sterling has lost 99.5% of its value since being introduced over 300 years ago. \n\nIn the United States, the dollar has lost 97% of its value since the end of WWI, about 100 years ago. \n\nThis means a steak that cost $0.30 in 1920... was $3 in 1990… and about $15 today, in the year 2020!",
            title:
              "Who should care that the government can print unlimited money?",
          },
          FiatLosesValueOverTime: {
            answers: [
              "Every fiat currency that ever existed has lost a massive amount of value.",
              "The value stays the same forever.",
              "The look and design of paper bills is updated every 10 years or so.",
            ],
            feedback: [
              "Correct. This is true even for USD, which has lost 97% of its value during the last 100 years.",
              "Incorrect. Please try again.",
              "Not quite. Although the design of papers bills may change, this has nothing to do with their value.",
            ],
            question: "What happens to the value of all fiat money over time?",
            text:
              "That is correct. \n\nIn the history of the world, there have been 775 fiat currencies created. Most no longer exist, and the average life for any fiat money is only 27 years.\n\nThe British Pound is the oldest fiat currency. It has lost more than 99% of its value since 1694. \n\nThere is no precedent for any fiat money maintaining its value over time. This is inflation. \nIt is effectively a form of theft of your own hard earned money !",
            title: "Does this mean that all fiat money loses value over time?",
          },
          OtherIssues: {
            answers: [
              "Money is difficult to move around the world, and can also be surveilled.",
              "Money is no longer needed in the 21st Century.",
              "Money is the root of all evil.",
            ],
            feedback: [
              "Correct. We will explain more about these issues in subsequent quiz modules. Keep digging!!",
              "Wrong answer. You know that is not true.",
              "While some may believe this to be so, it is not the answer we are looking for here.",
            ],
            question: "What are some other issues that exist with fiat money?",
            text:
              "Yes, there are many other issues that exist with modern fiat money. \n\nFirst, it can be extremely difficult to move money around the world. Often, governments will outright restrict the movement -- and sometimes even confiscate money -- without a valid reason or explanation. And even when you can send money, high transaction fees make it very expensive.\n\nSecond, even in the US, there has been a complete loss of privacy, as the majority of commerce takes places with debit and credit cards, as well as online with other systems such as PayPal and Apple Pay.\n\nEver notice how an ad appears in your social media or Gmail just moments after searching for a certain product or service? This is known as “surveillance capitalism”, and is based on companies selling your personal financial data.",
            title:
              "OK, fiat money loses value over time. Are there other issues?",
          },
        },
      },
      BitcoinWhySpecial: {
        title: "Bitcoin: Why is it special? ",
        questions: {
          LimitedSupply: {
            answers: [
              "Yes. There can never be more than 21 million bitcoin created.",
              "No. The government can create more bitcoin at any time.",
              "No, the bitcoin software can be changed to allow more bitcoins to be created.",
            ],
            feedback: [
              "Correct. By limiting the amount that can be created, Bitcoin is designed to increase in value over time.",
              "Wrong answer. The government has no control over Bitcoin.",
              "Incorrect. One of the key attributes of bitcoin is that the supply is limited forever.",
            ],
            question: "Is the supply of bitcoin limited forever?",
            text:
              "Governments can print fiat money in unlimited quantities. \n\nBy way of contrast, the supply of Bitcoin is fixed — and can never exceed 21 million coins. \n\nA continually increasing supply of fiat money creates inflation. This means that the money you hold today is less valuable in the future. \n\nOne simple example: \nA loaf of bread that cost about 8 cents in 1920. In the year 1990 one loaf cost about $1.00, and today the price is closer to $2.50 ! \n\nThe limited supply of bitcoin has the opposite effect, one of deflation. \n\nThis means that the bitcoin you hold today is designed to be more valuable in the future — because it is scarce.",
            title: "Special Characteristic #1:\nLimited Supply",
          },
          Decentralized: {
            answers: [
              "No. Bitcoin is completely “decentralized”.",
              "Yes. It is centrally controlled by the United Nations.",
              "Yes. It is centrally controlled by the world’s largest banks.",
            ],
            feedback: [
              "That is correct. There is no company, government or institution that controls bitcoin. Anyone can use bitcoin — all need is a smartphone and an internet connection.",
              "Wrong answer. Please try again.",
              "Incorrect. You already know this is not true!",
            ],
            question: "Is bitcoin centralized?",
            text:
              "Fiat money is controlled by banks and governments — which is why people refer to it as a “centralized” currency.\n\nBitcoin is not controlled by any person, government or company — which makes it “decentralized” \n\nNot having banks involved means that nobody can deny you access to bitcoin — because of race, gender, income, credit history, geographical location — or any other factor. \n\nAnybody — anywhere in the world — can access and use Bitcoin anytime you want. All you need is a computer or smartphone, and an internet connection!",
            title: "Special Characteristic #2: Decentralized",
          },
          NoCounterfeitMoney: {
            answers: [
              "No. It is impossible to counterfeit Bitcoin.",
              "Yes. Although creating fake bitcoin requires very specialized computers.",
              "Yes. The government can print as much bitcoin as it likes.",
            ],
            feedback: [
              "That is the right answer. In a subsequent quiz, Honey Badger will explain details as to why this is so!",
              "Incorrect. There is no way for anyone to copy or duplicate the value of a bitcoin.",
              "Wrong. Although the government can print unlimited dollars, it can not print bitcoin.",
            ],
            question: "Can people counterfeit Bitcoin?",
            text:
              "Paper money, checks and credit card transactions can all be counterfeit, or faked. \n\nThe unique software that runs the Bitcoin network eliminates the possibility of duplicating money for counterfeit purposes.  \n\nNew bitcoin can only be issued if there is agreement amongst the participants in the network. People who are voluntarily running bitcoin software on their own computers and smartphones.\n\nThis ensures that it is impossible to counterfeit, or create fake bitcoins.",
            title: "Special Characteristic #3: \nNo Counterfeit Money",
          },
          HighlyDivisible: {
            answers: [
              "0.00000001 BTC",
              "One whole bitcoin. It is not possible to use anything less.",
              "0.01 BTC",
            ],
            feedback: [
              "Yes. You can divide a bitcoin into 100,000,000 pieces. As you already know, the smallest unit of bitcoin — B0.00000001 — is known as a “sat”.",
              "Wrong. Bitcoin is highly divisible. You can easily use a very small fraction of a bitcoin.",
              "Incorrect. Although the smallest unit of US currency is one penny, a bitcoin is divisible by much more than 100x.",
            ],
            question:
              "What is the smallest amount of Bitcoin one can own, or use?",
            text:
              'Old-fashioned fiat money can only be spent in amounts as small as one penny — or two decimal places for one US Dollar ($0.01).\n\nOn the other hand, Bitcoin can be divided 100,000,000 times over. This means that you could spend as little as ₿0.00000001. You will note the "₿" symbol, which is the Bitcoin equivalent of "$". Sometimes you will also see the use of BTC, instead of ₿.\n\nBy way of contrast, Bitcoin can handle very small payments — even those less than one US penny!',
            title: "Special Characteristic #4: \nHighly Divisible",
          },
          securePartOne: {
            answers: [
              "Yes. The bitcoin network is very secure.",
              "Maybe. It depends on the day of the week.",
              "No. It is open source software, and is easily attacked.",
            ],
            feedback: [
              "Correct. In fact, the Bitcoin network has never once been hacked. Answer the next question to learn more!",
              "Nice try, but wrong. The bitcoin network is safe and secure — 24 hours a day, 365 days a year.",
              "Icorrect. Although bitcoin is indeed “open source” software — or available to the public for free — is still extremely secure.",
            ],
            question: "Is the Bitcoin network secure?",
            text:
              "The bitcoin network is worth well over $100 billion today. Accordingly, the network must be very secure — so that money is never stolen. \n\nBitcoin is known as the world’s first cryptocurrency. \n\nThe “crypto” part of the name comes from cryptography. Simply put, cryptography protects information through very complex math functions. \n\nMost people do not realize — but Bitcoin is actually the most secure computer network in the world ! \n\n(you may have heard about bitcoin “hacks” — which we will debunk in the next quiz)",
            title: "Special Characteristic #5: \nSecure -- Part I",
          },
          securePartTwo: {
            answers: [
              "No. Bitcoin has never been hacked.",
              "Yes. Bitcoin gets hacked frequently.",
              "Yes. Bitcoin usually gets hacked on holidays, when traditional banks are closed.",
            ],
            feedback: [
              "That is correct. The bitcoin network has never been compromised. However, it is important to use only secure digital wallets to keep your personal bitcoins safe at all times.",
              "Wrong. Please try again.",
              "No silly, you know that is not the correct answer.",
            ],
            question: "Has Bitcoin ever been hacked?",
            text:
              "To be direct: the bitcoin network itself has never been hacked. Never once.\n\nThen what exactly has been hacked? \n\nCertain digital wallets that did not have proper security in place. \n\nJust like a physical wallet holds fiat currency (in the form of paper bills), digital wallets hold some amount of bitcoin. \n\nIn the physical world, criminals rob banks — and walk away with US Dollars. The fact that someone robbed a bank does not have any relationship as to whether the US Dollar is stable or reliable money. \n\nSimilarly, some computer hackers have stolen bitcoin from insecure digital wallets — the online equivalent of a bank robbery. \n\nHowever, it is important to know that the bitcoin network has never been hacked or compromised !",
            title: "Special Characteristic #5: \nSecure -- Part II",
          },
        },
      },
    },
    finishText:
      "That's all for now, we'll let you know when there's more to unearth",
    getRewardNow: "Answer quiz",
    keepDigging: "Keep digging!",
    phoneNumberNeeded: "Phone number required",
    quizComplete: "Quiz completed and {amount: number} sats earned",
    reviewQuiz: "Review quiz",
    satAccumulated: "Sats accumulated",
    satsEarned: "{formattedNumber|sats} earned",
    sectionsCompleted: "You've completed",
    title: "Earn",
    unlockQuestion: "To unlock, answer the question:",
    youEarned: "You Earned",
  },
  GetStartedScreen: {
    getStarted: "Get Started",
    headline: "Wallet powered by Galoy",
  },
  MapScreen: {
    locationPermissionMessage:
      "Activate your location so you know where you are on the map",
    locationPermissionNegative: "Cancel",
    locationPermissionNeutral: "Ask Me Later",
    locationPermissionPositive: "OK",
    locationPermissionTitle: "Locate yourself on the map",
    payBusiness: "pay this business",
    title: "Map",
  },
  HomeScreen: {
    receive: "Receive",
    send: "Send",
    title: "Home",
    updateAvailable: "An update is available.\nTap to update now",
    useLightning: "We use the Lightning Network.",
    myAccounts: "My Accounts",
  },
  PinScreen: {
    attemptsRemaining:
      "Incorrect PIN. {attemptsRemaining: number} attempts remaining.",
    oneAttemptRemaining: "Incorrect PIN. 1 attempt remaining.",
    setPin: "Set your PIN code",
    setPinFailedMatch: "Pins didn't match - Set your PIN code",
    storePinFailed: "Unable to store your pin.",
    tooManyAttempts: "Too many failed attempts. Logging out.",
    verifyPin: "Verify your PIN code",
  },
  PriceHistoryScreen: {
    oneDay: "1D",
    oneMonth: "1M",
    oneWeek: "1W",
    oneYear: "1Y",
    fiveYears: "5Y",
    satPrice: "Price for 100,000 sats: ",
    last24Hours: "last 24 hours",
    lastWeek: "last week",
    lastMonth: "last month",
    lastYear: "last year",
    lastFiveYears: "last five years",
  },
  PrimaryScreen: {
    title: "Home",
  },
  ReceiveWrapperScreen: {
    activateNotifications:
      "Do you want to activate notifications to be notified when the payment has arrived?",
    copyClipboard: "Invoice has been copied in the clipboard",
    copyClipboardBitcoin: "Bitcoin address has been copied in the clipboard",
    invoicePaid: "This invoice has been paid",
    setNote: "set a note",
    tapQrCodeCopy: "Tap QR Code to Copy",
    title: "Receive Bitcoin",
    usdTitle: "Receive USD",
    error:
      "Failed to generate invoice. Please contact support if this problem persists.",
    copyInvoice: "Copy Invoice",
    shareInvoice: "Share Invoice",
    addAmount: "Request Specific Amount",
    expired: "The invoice has expired",
    expiresIn: "Expires in",
    updateInvoice: "Update Invoice",
    flexibleAmountInvoice: "Flexible Amount Invoice",
    copyAddress: "Copy Address",
    shareAddress: "Share Address",
    generatingInvoice: "Generating Invoice",
    regenerateInvoice: "Regenerate Invoice",
    useABitcoinOnchainAddress: "Use a Bitcoin onchain address",
    useALightningInvoice: "Use a Lightning Invoice",
    setANote: "Set a Note",
    invoiceAmount: "Invoice Amount",
  },
  RedeemBitcoinScreen: {
    title: "Redeem Bitcoin",
    usdTitle: "Redeem for USD",
    error:
      "Failed to generate invoice. Please contact support if this problem persists.",
    redeemingError:
      "Failed to redeem Bitcoin. Please contact support if this problem persists.",
    submissionError:
      "Failed to submit withdrawal request. Please contact support if this problem persists.",
    minMaxRange: "Min: {minimumAmount: string}, Max: {maximumAmount: string}",
    redeemBitcoin: "Redeem Bitcoin",
    amountToRedeemFrom: "Amount to redeem from {domain: string}",
    redeemAmountFrom: "Redeem {amountToRedeem: string} from {domain: string}",
  },
  ScanningQRCodeScreen: {
    invalidContent:
      "We found:\n\n{found: string}\n\nThis is not a valid Bitcoin address or Lightning invoice",
    expiredContent: "We found:\n\n{found: string}\n\nThis invoice has expired",
    invalidTitle: "Invalid QR Code",
    noQrCode: "We could not find a QR code in the image",
    title: "Scan QR",
    invalidContentLnurl:
      "We found:\n\n{found: string}\n\n is not currently supported",
  },
  SecurityScreen: {
    biometricDescription: "Unlock with fingerprint or facial recognition.",
    biometricSubtitle: "Enable biometric authentication",
    biometricTitle: "Biometric",
    biometryNotAvailable: "Biometric sensor is not available.",
    biometryNotEnrolled:
      "Please register at least one biometric sensor in order to use biometric based authentication.",
    hideBalanceDescription:
      "Hides your balance on the home screen by default, so you don't reveal it to anyone looking at your screen.",
    hideBalanceSubtitle: "Hide balance",
    hideBalanceTitle: "Balance",
    pinDescription:
      "PIN is used as the backup authentication method for biometric authentication.",
    pinSubtitle: "Enable PIN",
    pinTitle: "PIN Code",
    setPin: "Set PIN",
  },
  SendBitcoinConfirmationScreen: {
    amountLabel: "Amount:",
    confirmPayment: "Confirm payment",
    confirmPaymentQuestion: "Do you want to confirm this payment?",
    destinationLabel: "To:",
    feeLabel: "Fee",
    memoLabel: "Note:",
    paymentFinal: "Payments are final.",
    stalePrice:
      "Your bitcoin price is old and was last updated {timePeriod} ago. Please restart the app before making a payment.",
    title: "Confirm Payment",
    totalLabel: "Total:",
    totalExceed: "Total exceeds your balance of {balance: string}",
    maxFeeSelected:
      "This is the maximum fee you will be charged for this transaction.  It may end up being less once the payment has been made.",
    feeError: "Failed to calculate fee",
  },
  SendBitcoinDestinationScreen: {
    usernameNowAddress:
      "{bankName: string} usernames are now {bankName: string} addresses.",
    usernameNowAddressInfo:
      'When you enter a {bankName: string} username, we will add "@{lnDomain: string}" to it (e.g maria@{lnDomain: string}) to make it an address. Your username is now a {bankName: string} address too.\n\nGo to your {bankName: string} address page from your Settings to learn how to use it or to share it to receive payments.',
    enterValidDestination: "Please enter a valid destination",
    destinationOptions:
      "You can send to a {bankName: string} address, LN address, LN invoice, or BTC address.",
    expiredInvoice: "This invoice has expired. Please generate a new invoice.",
    wrongNetwork:
      "This invoice is for a different network. Please generate a new invoice.",
    invalidAmount:
      "This contains an invalid amount. Please regenerate with a valid amount.",
    usernameDoesNotExist:
      "{lnAddress: string} doesn't seem to be a {bankName: string} address that exists.",
    usernameDoesNotExistAdvice:
      "Either make sure the spelling is right or ask the recipient for an LN invoice or BTC address instead.",
    selfPaymentError: "{lnAddress: string} is your {bankName: string} address.",
    selfPaymentAdvice:
      "If you want to send money to another account that you own, you can use an invoice, LN or BTC address instead.",
    lnAddressError:
      "We can't reach this Lightning address. If you are sure it exists, you can try again later.",
    lnAddressAdvice:
      "Either make sure the spelling is right or ask the recipient for an invoice or BTC address instead.",
    unknownLightning:
      "We can't parse this Lightning address. Please try again.",
    unknownOnchain: "We can't parse this Bitcoin address. Please try again.",
    newBankAddressUsername:
      "{lnAddress: string} exists as a {bankName: string} address, but you've never sent money to it.",
    confirmModal: {
      title: 'You\'ve never sent money to "{lnAddress: string}" before.',
      body1:
        "Please make sure the recipient gave you a {bankName: string} address,",
      bold2bold: "not a username from another wallet.",
      body3:
        "Otherwise, the money will go to a {bankName: string} Account that has the “{lnAddress: string}” address.\n\nCheck the spelling of the first part of the address as well. e.g. jackie and jack1e are 2 different addresses",
      warning:
        "If the {bankName: string} address is entered incorrectly, {bankName: string} can't undo the transaction.",
      checkBox: "{lnAddress: string} is the right address.",
      confirmButton: "I'm 100% sure",
    },
    clipboardError: "Error getting value from clipboard",
  },
  SendBitcoinScreen: {
    amount: "Amount",
    amountExceed: "Amount exceeds your balance of {balance: string}",
    amountIsRequired: "Amount is required",
    cost: "Cost",
    destination: "Destination",
    destinationIsRequired: "Destination is required",
    fee: "network fee",
    feeCalculationUnsuccessful: "Calculation unsuccessful ⚠️",
    input: "Username, invoice, or address",
    invalidUsername: "Invalid username",
    noAmount:
      "This invoice doesn't have an amount, so you need to manually specify how much money you want to send",
    notConfirmed:
      "Payment has been sent\nbut is not confirmed yet\n\nYou can check the status\nof the payment in Transactions",
    note: "Note or label",
    success: "Payment has been sent successfully",
    title: "Send Bitcoin",
    failedToFetchLnurlInvoice: "Failed to fetch lnurl invoice",
    lnurlInvoiceIncorrectAmount:
      "The lnurl server responded with an invoice with an incorrect amount.",
    lnurlInvoiceIncorrectDescription:
      "The lnurl server responded with an invoice with an incorrect description hash.",
  },
  SettingsScreen: {
    activated: "Activated",
    tapLogIn: "Tap to log in",
    addressScreen: "Ways to get paid",
    tapUserName: "Tap to set username",
    title: "Settings",
    darkMode: "Dark Mode",
    setToDark: "Mode: dark.",
    setToLight: "Mode: light.",
    darkDefault: "Mode: dark, (Default).",
    lightDefault: "Mode: light, (Default).",
    csvTransactionsError:
      "Unable to export transactions to csv. Something went wrong. If issue persists please contact support.",
    lnurlNoUsername:
      "To generate an lnurl address you must first set a username.  Do you want to set a username now?",
    copyClipboardLnurl: "Lnurl address has been copied in the clipboard",
    deleteAccount: "Delete Account",
    defaultWallet: "Default Account",
    rateUs: "Rate us on {storeName: string}",
  },
  DefaultWalletScreen: {
    title: "Default Account",
    info:
      "Your default account is the account that is selected by default when sending and receiving payments. You can change this setting for individual payments on the mobile app. However, payments received through the cash register or your Lightning address will always go to the default account.\n\nTo avoid Bitcoin's volatility, choose Stablesats. This allows you to maintain a stable amount of money while still being able to send and receive payments.\n\nYou can change this setting at any time, and it won't affect your current balance.",
  },
  Languages: {
    "DEFAULT": "Default (OS)",
  },
  StablesatsModal: {
    header: "With Stablesats, you now have a USD account added to your wallet!",
    body:
      "You can use it to send and receive Bitcoin, and instantly transfer value between your BTC and USD account. Value in the USD account will not fluctuate with the price of Bitcoin. This feature is not compatible with the traditional banking system.",
    termsAndConditions: "Read the Terms & Conditions.",
    learnMore: "Learn more about Stablesats",
  },
  NewNameBlinkModal: {
    header: "Coming soon: BBW is being renamed to Blink!",
    body:
      "BBW launched in 2021 in El Zonte, El Salvador to support the creation of a circular Bitcoin economy. Now, it’s growing into the everyday Lightning wallet for people around the globe. This year, we are renaming to Blink to better serve our growing customer base.",
    ok: "Sounds good!",
    learnMore: "Learn more at blink.sv",
  },
  SplashScreen: {
    update:
      "Your app is outdated. An update is needed before the app can be used.\n\nThis can be done from the PlayStore for Android and Testflight for iOS",
  },
  TransactionDetailScreen: {
    detail: "Transaction Details",
    paid: "Paid to/from",
    received: "You received",
    spent: "You spent",
    receivingAccount: "Receiving Account",
    sendingAccount: "Sending Account",
  },
  TransactionLimitsScreen: {
    receive: "Receive",
    withdraw: "Withdraw",
    perDay: "per day",
    perWeek: "per week",
    unlimited: "Unlimited",
    remaining: "Remaining",
    stablesatTransfers: "Stablesat Transfers",
    internalSend: "Send to {bankName: string} User",
    error: "Unable to fetch limits at this time",
    contactUsMessageBody:
      "Hi, I will like to increase the transaction limits of my {bankName: string} account.",
    contactUsMessageSubject: "Request To Increase Transaction Limits",
    howToIncreaseLimits: "How can I increase my transaction limits?",
  },
  TransactionScreen: {
    noTransaction: "No transaction to show",
    title: "Transactions",
    recentTransactions: "Recent transactions",
    transactionHistoryTitle: "Transaction History",
  },
  TransferScreen: {
    title: "Transfer",
    percentageToConvert: "% to convert",
  },
  UsernameScreen: {
    "3CharactersMinimum": "at least 3 characters are necessary",
    "50CharactersMaximum": "Username cannot be longer than 50 characters",
    "available": "✅  {username: string} is available",
    "confirmSubtext": "The username is permanent and can not be changed later",
    "confirmTitle": "Set {username: string} as your username?",
    "forbiddenStart":
      "Cannot start with lnbc1, bc1, 1, or 3 and cannot be a Bitcoin address or Lightning invoice",
    "letterAndNumber":
      "Only lowercase letter, number and underscore (_) are accepted",
    "emailAddress": "Username must not be email address",
    "notAvailable": "❌  {username: string} is not available",
    "success": "{username: string} is now your username!",
    "usernameToUse": "What username do you want to use?",
  },
  WelcomeFirstScreen: {
    bank:
      "Bitcoin is designed to let you store, send and receive money, without relying on a bank or credit card.",
    before:
      "Before Bitcoin, people had to rely on banks or credit card providers, to spend, send and receive money.",
    care: "Why should I care?",
    learn:
      "I don't mean to badger you, but there's lot more to learn, dig in...",
    learnToEarn: "Learn to Earn",
  },
  PhoneInputScreen: {
    header: "Enter your phone number, and we'll text you an access code.",
    headerVerify: "Verify you are human",
    errorRequestingCaptcha:
      "Something went wrong verifying you are human, please try again later.",
    placeholder: "Phone Number",
    verify: "Click to Verify",
    sms: "Send via SMS",
    whatsapp: "Send via WhatsApp",
  },
  PhoneValidationScreen: {
    errorLoggingIn: "Error logging in. Did you use the right code?",
    header:
      "To confirm your phone number, enter the code we just sent you by {channel: string} on {phoneNumber: string}",
    need6Digits: "The code needs to have 6 digits",
    placeholder: "6 Digit Code",
    sendAgain: "Send Again",
    tryAgain: "Try Again",
    sendViaOtherChannel:
      "You used {channel: string} to receive the code.\n\nYou can try receiving via {other: string} instead",
  },
  common: {
    account: "Account",
    transactionLimits: "Transaction Limits",
    activateWallet: "Activate Wallet",
    amountRequired: "Amount is required",
    back: "Back",
    backHome: "Back home",
    bank: "Bank",
    bankAccount: "Cash Account",
    bankAdvice: "{bankName: string} Advice",
    bankInfo: "{bankName: string} Info",
    beta: "beta",
    bitcoin: "Bitcoin",
    bitcoinPrice: "Bitcoin Price",
    btcAccount: "BTC Account",
    cancel: "Cancel",
    close: "Close",
    confirm: "Confirm",
    convert: "Convert",
    currency: "Currency",
    currencySyncIssue: "Currency issue. Refresh needed",
    csvExport: "Export transactions as CSV",
    date: "Date",
    description: "Description",
    domain: "Domain",
    email: "Email",
    error: "Error",
    fatal: "Fatal",
    fee: "fee",
    Fee: "Fee",
    fees: "Fees",
    firstName: "First Name",
    from: "From",
    hour: "hour",
    hours: "hours",
    invoice: "Invoice",
    language: "Language",
    languagePreference: "Language preference",
    lastName: "Last Name",
    later: "Later",
    loggedOut: "You have been logged out.",
    logout: "Log Out",
    minutes: "minutes",
    needWallet: "Validate your phone to open your wallet",
    next: "Next",
    No: "No",
    note: "Note",
    notification: "Notification",
    ok: "OK",
    openWallet: "Open Wallet",
    phoneNumber: "Phone Number",
    rate: "Rate",
    reauth: "Your session has expired. Please log in again.",
    restart: "Restart",
    sats: "sats",
    search: "Search",
    security: "Security",
    send: "Send",
    setAnAmount: "set an amount",
    share: "Share",
    shareBitcoin: "Share Bitcoin Address",
    shareLightning: "Share Lightning Invoice",
    soon: "Coming soon!",
    success: "Success!",
    to: "To",
    total: "Total",
    transactions: "Transactions",
    transactionsError: "Error loading transactions",
    tryAgain: "Try Again",
    type: "Type",
    usdAccount: "USD Account",
    username: "Username",
    usernameRequired: "Username is required",
    viewTransaction: "View transaction",
    yes: "Yes",
    pending: "pending",
    today: "Today",
    yesterday: "Yesterday",
    thisMonth: "This month",
    prevMonths: "Previous months",
    problemMaybeReauth:
      "There was a problem with your request. Please retry in one minute. If the problem persist, we recommend that you log out and log back in. You can log out by going into Settings > Account > Log out",
  },
  errors: {
    generic: "There was an error.\nPlease try again later.",
    invalidEmail: "Invalid email",
    invalidPhoneNumber: "is not a valid phone number",
    tooManyRequestsPhoneCode:
      "Too many requests. Please wait before requesting another text message.",
    network: {
      server: "Server Error. Please try again later",
      request: "Request issue.\nContact support if the problem persists",
      connection: "Connection issue.\nVerify your internet connection",
    },
    unexpectedError: "Unexpected error occurred",
    restartApp: "Please restart the application.",
    problemPersists: "If problem persists contact support.",
    fatalError:
      "Sorry we appear to be having issues loading the application data.  If problems persist please contact support.",
    showError: "Show Error",
    clearAppData: "Clear App Data and Logout",
  },
  notifications: {
    payment: {
      body: "You just received {value: string} sats",
      title: "Payment received",
    },
  },
  support: {
    contactUs: "Need help?  Contact us.",
    whatsapp: "WhatsApp",
    email: "Email",
    statusPage: "Status Page",
    telegram: "Telegram (community)",
    defaultEmailSubject: "{bankName: string} - Support",
    defaultSupportMessage:
      "Hey there! I need some help with {bankName: string}, I'm using the version {version: string} on {os: string}.",
    deleteAccount: "Hello. Please delete my account.",
    deleteAccountEmailSubject:
      "Account deletion request: {phoneNumber: string}",
    emailCopied: "email {email: string} copied to clipboard",
  },
  lnurl: {
    overLimit: "You can't send more than max amount",
    underLimit: "You can't send less than min amount",
    commentRequired: "Comment required",
    viewPrintable: "View Printable Version",
  },
  DisplayCurrencyScreen: {
    errorLoading: "Error loading list of currencies",
  },
  AmountInputScreen: {
    enterAmount: "Enter Amount",
    setAmount: "Set Amount",
    maxAmountExceeded: "Amount must not exceed {maxAmount: string}.",
    minAmountNotMet: "Amount must be at least {minAmount: string}.",
  },
  AmountInputButton: {
    tapToSetAmount: "Tap to set amount",
  },
  AppUpdate: {
    needToUpdateSupportMessage:
      "I need to update my app to the latest version. I'm using the {os: string} app with version {version: string}.",
    versionNotSupported: "This mobile version is no longer supported",
    updateMandatory: "Update is mandatory",
    tapHereUpdate: "Tap here to update now",
    contactSupport: "Contact Support",
  },
  marketPlace: {
    add: "Add",
    name: "Name",
    direction: "Direction",
    marketPlace: "Marketplace",
    report: "Report",
    search: "Search",
    distance: "Distance",
    relevance: "Relevance",
    post_what_would_you_like_too_offer_for_bitcoin:
      "Post what would you like too offer for bitcoin",
    create_post: "Create Post",
    my_post: "My Posts",
    register_store: "Register Store",
    next: "Next",
    skip: "Skip",
    share_location: "Share location",
    use_my_current_position: "Use My Current Location",
    open_hour: "Open Hour",
    cuisines: "Cuisines",
    description: "Description",
    update_cover_image: "Update cover Image",
    location: "Location",
    submit: "Submit",
    upload_image: "Upload Image",
    image_uploaded: "Image uploaded",
    account_contact_will_be_filled: "Account contact will be filled",
    use_existing_information: "Use Existing Information",
    phone: "Phone",
    phone_number: "Phone number",
    email: "Email",
    email_is_required: "Email is required",
    email_is_invalid: "Email is invalid",
    price: "Price",
    name_is_required: "Name is required",
    name_length_validation: "Name must be more than 2 characters",
    description_is_required: "Description is required",
    description_must_be_more_than_2_characters:
      "Description must be more than 2 characters",
    you_must_add_at_least_one_image: "You must add at least one image",
    enter_your_own_tags: "Enter your own tags",
    tags: "Tags",
    your_selected_tag: "Your selected tag",
    select_your_address: "Select your address",
    enter_your_location: "Enter your location",
    search_your_location: "Search your location",
    or_select_your_address: "Or Select Your Address",
    there_are_no_posts: "There are no posts around you",
    cant_find_tag_Add_your_own: "Can't find tag? Add your own",
    you_can_select_up_to_5_tags: "You can select up to 5 tags.",
    something_wrong_when_upload_image: "Something wrong when upload image",
    tap_to_find_your_place: "Tap to find your place",
    you_are_here: "You are here",
    something_wrong_when_find_location: "Something wrong when find location",
    loading_data: "Loading data...",
    my_posts: "My posts",
    you_dont_have_any_post: "You don't have any post",
    you_need_to_enable_location_to_see_posts_around_you:
      "You need to enable location to see posts around you",
    list_view: "List View",
    your_post_is_submitted_to_review: "Your post is submitted to review",
    this_post_has_been_reported: "This post has been reported",
    thank_you_for_submitting_this_post: "Thank you for submitting this post",
    we_will_review_it_shortly:
      "We will review it shortly and remove if it violate any of our policy",
    tell_us_what_is_wrong_with_this_post:
      "Tell us what is wrong with this post",
    whats_going_on: `What's going on`,
  },
};

export default en;
