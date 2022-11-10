import { Sequelize, Model, DataTypes} from "sequelize";

const user = 'postgres';
const host = 'localhost';
const database = 'matchdb';
const password = 'postgres';
const port = '5432';

console.log(user);

export class Waiting extends Model {
}

export class CreditCards extends Model {
}

function connectPostgres() {
    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect:'postgres',
        logging: false
    })
    return sequelize;
}

function initCreditCardsModel(sequelize) {
    CreditCards.init({
        creditcardno: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        creditcardtype: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'creditcards',
        freezeTableName: true,
        timestamps: false
    });
}

export async function readCreditCardsQuery() {
    const sequelize = connectPostgres();
    initCreditCardsModel(sequelize);
    const creditCards = await CreditCards.findAll();
    return creditCards;
}

export async function insertCreditCardsQuery(creditCardsArray) {
    const sequelize = connectPostgres();
    initCreditCardsModel(sequelize);
    CreditCards.bulkCreate(creditCardsArray);
}

export async function deleteCreditCardsQuery() {
    const sequelize = connectPostgres();
    initCreditCardsModel(sequelize);
    CreditCards.destroy({
        where: {} 
    });
}