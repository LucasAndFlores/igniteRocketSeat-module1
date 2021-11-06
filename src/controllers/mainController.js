const { v4: uuidv4 } = require('uuid')
const customers = []

function getBalance (statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === "credit") {
            return acc + operation.amount
        } else {
            return acc - operation.amount
        }
    }, 0)

    return balance
}

const mainController = {

   verifyifExistsAccountCPF: (req, res, next) => {
        const { cpf } = req.headers
    
        const customer = customers.find((customer) => customer.cpf === cpf)

        if(!customer) {
            return res.status(400).json({ error: 'Customer not found' })
        }

        req.customer = customer

        return next()
    },

    createAccount: (req, res) => {
        const {cpf, name} = req.body
        const customerAlreadyExists = customers.some((customer) => 
            customer.cpf === cpf
        )

        if(customerAlreadyExists) {
            return res.status(400).json({ error: 'Customer already exists'})
        }

        customers.push({
            cpf,
            name,
            id: uuidv4(),
            statement: [],
        })

        return res.status(201).json({ message: 'Account created successfully'})
    },

    findStatement: (req, res) => {
        const { customer } = req
        return res.json(customer)

    },

    createDeposit: (req, res) => {
        const {description, amount} = req.body
        const {customer} = req

        if (!description || !amount ) {
            res.status(400).json({error: 'Needs amount, description and type of transaction'})
        }

        const statementOperation = {
            description,
            amount,
            created_at: new Date(),
            type: "credit"
        }

        customer.statement.push(statementOperation)

        return res.status(201).json(statementOperation)

    }, 

    createWithDraw: (req, res) => {
        const { amount } = req.body
        const { customer } = req

        const balance = getBalance(customer.statement)

        if ( balance < amount ) {
            return res.status(400).json({ error: 'Insufficient founds!'})
        }

        const statementOperation = {
            amount,
            created_at: new Date(),
            type: "debit"
        }

        customer.statement.push(statementOperation)

        return res.status(201).json(statementOperation)

    },

    getBydate: (req, res) => {
        const { customer } = req
        const { date } = req.query

        const dateFormat = new Date(date + " 00:00");

        const statement = customer.statement.filter(statement => {
            statement.created_at.toDateString() === new Date(dateFormat).toDateString()
        })

        return res.json(customer.statement)
    },

    updateAccount: (req, res) => {
        const { customer } = req
        const { name } = req.body

        customer.name = name

        return res.status(201).send("Name changed")
    },

    deleteAccount: (req, res) => {
        const { customer } = req

        customers.splice(customer, 1)

        return res.status(200).json(customers)
    },

    getBalanceAccount: (req, res) => {

        const { customer } = req

        const balance = getBalanceAccount(customer.statement)

        console.log(balance)

        return res.status(200).send(balance)


    }
}

module.exports = mainController;