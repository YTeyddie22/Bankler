'use strict';

// Bankler APP

//! Main inforamtion
const account1 = {
	owner: 'Teddy Yongo',
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, //! in percentage
	pin: 1111,

	movementsDates: [
		'2021-08-18T21:31:17.178Z',
		'2021-09-23T07:42:02.383Z',
		'2021-09-28T09:15:04.904Z',
		'2021-10-01T10:17:24.185Z',
		'2021-10-08T14:11:59.604Z',
		'2021-11-27T17:01:17.194Z',
		'2021-12-11T23:36:17.929Z',
		'2022-01-05T10:51:36.790Z',
	],
	currency: 'EUR',
	locale: 'en-Ke',
};

const account2 = {
	owner: 'Lyveen Barbara',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		'2021-10-01T13:15:33.035Z',
		'2021-10-30T09:48:16.867Z',
		'2021-11-25T06:04:23.907Z',
		'2021-11-25T14:18:46.235Z',
		'2021-12-05T16:33:06.386Z',
		'2021-12-10T14:43:26.374Z',
		'2021-12-25T18:49:59.371Z',
		'2022-01-04T12:01:20.894Z',
	],
	currency: 'USD',
	locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIncome = document.querySelector('.summary__value--in');
const labelSumExpenditure = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const loginBtn = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const loginUserName = document.querySelector('.login__input--user');
const loginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

//* 1 Format the transaction date

const formatTransactionsDate = (date, locale) => {
	const calcDaysPassed = (day1, day2) => {
		return Math.round((Math.abs(day2 - day1) / 1000) * 60 * 60 * 24);
	};

	const daysPassed = calcDaysPassed(new Date(), date);

	if (daysPassed === 0) return 'Today';
	if (daysPassed === 1) return 'Yesterday';
	if (daysPassed <= 7) return `${daysPassed} days ago`;

	return Intl.DateTimeFormat(locale).format(date);
};

//* Format the currency

const formatCurrency = function (value, locale, currency) {
	return Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency,
	}).format(value);
};

//! 1 Display Transactions

const showTransactions = function (acc, sort = false) {
	containerMovements.innerHTML = '';

	const transactions = sort
		? acc.movements.slice().sort((a, b) => a - b)
		: acc.movements;

	transactions.forEach((transaction, i) => {
		let type = transaction > 0 ? 'Deposit' : 'Withdrawal';
		const date = new Date(acc.movementsDates[i]);

		const displayDate = formatTransactionsDate(date, acc.locale);
		const displayCurrency = formatCurrency(
			transaction,
			acc.locale,
			acc.currency
		);

		let html = `
        <div class="movements__row">
					<div class="movements__type movements__type--${type.toLowerCase()}">${
			i + 1
		} ${type.toLowerCase()}</div>
					<div class="movements__date">${displayDate}</div>
					<div class="movements__value">${displayCurrency}</div>
				</div>
        `;

		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

showTransactions(account1);

//! 2. Creating a userName for each accounts

const createUserName = function (accounts) {
	accounts.forEach((acc) => {
		acc.userName = acc.owner
			.split(' ')
			.map((name) => name[0])
			.join('')
			.toLowerCase();
	});
};

createUserName(accounts);

//! 3. Display balance

const displayBalance = function (account) {
	account.balance = account.movements.reduce(
		(account, cur) => account + cur,
		0
	);

	labelBalance.textContent = formatCurrency(
		account.balance,
		account.locale,
		account.currency
	);
};
displayBalance(account1);

//! Display SummaryValues.

const calcSummaryValues = function (summaryValue) {
	//* Income
	const income = summaryValue.movements
		.filter((el) => el > 0)
		.reduce((acc, cur) => acc + cur, 0);

	labelSumIncome.textContent = formatCurrency(
		income,
		summaryValue.locale,
		summaryValue.currency
	);

	//* Expenditure

	const expenditure = summaryValue.movements
		.filter((el) => el < 0)
		.reduce((acc, cur) => acc + cur, 0);

	labelSumExpenditure.textContent = formatCurrency(
		Math.abs(expenditure),
		summaryValue.locale,
		summaryValue.currency
	);

	//* Interest

	const interest = summaryValue.movements
		.filter((el) => el > 0)
		.map((deposit) => (deposit * summaryValue.interestRate) / 100)
		.filter((interest) => interest > 0)
		.reduce((acc, cur) => acc + cur, 0);

	labelSumInterest.textContent = formatCurrency(
		interest,
		summaryValue.locale,
		summaryValue.currency
	);
};

calcSummaryValues(account1);
