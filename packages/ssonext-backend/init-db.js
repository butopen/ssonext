
const {Pool} = require("pg");
const password = "ssonext_localhost_askjhsakjsa-b29183712983";
(async () => {

    let pool = new Pool({
        "host": "localhost",
        "user": "postgres",
        password ,
        "database": "postgres",
        "port": 5434
    })

    let client = await pool.connect()
    const res = await client.query('SELECT version()')
    console.log("Postgres version: ", JSON.stringify(res.rows))

    await client.query(`create user ssonext with encrypted password '${password}';`)
    await client.query('create database ssonext;')
    await client.query('grant all privileges on database ssonext to ssonext;')

    console.log("Done. Process exit... ")
    process.exit()

})()
