// import * as db from "./db.js";
import pg from 'pg';
const { Pool } = pg;

let pool;

async function getProfiles() {
  const res = await pool.query(`
      SELECT * FROM profiles
  `);
  return res.rows
}


export const handler = async event => {
    if (!pool) {
      const connectionString = process.env.DATABASE_URL;
      pool = new Pool({
        connectionString,
        application_name: "",
        max: 1,
      });
    }
    
    
    console.log("event.body: ", event.body)
    try {
        const method = event.requestContext.http.method;
        switch (method) {
            case "GET":
                // receive: nothing OR getId param
                // return: all items in DB or the particular item caught from getId
                const profiles = await getProfiles();
console.log("profiles ---- ", profiles)
                return {
                  statusCode: 200,
                  body: JSON.stringify(profiles)
                }
        // const response = {
        //     statusCode: 200,
        //     headers: {
        //         "content-type": "application/json" },
        //     body: JSON.stringify({message: 'Hello from Lambda!! GET@'}),
            
        // };
        // return response;
                /*case "POST": {
                    // receive: body.newItem
                    // return: new list of items in DB
                    const body = JSON.parse(event.body);
                    const {error} = body;
                    if (error) throw (`Testing Error was Successful and received: '${error}'`);
                    
                    const { newItem } = body;
                    const addItem = await db.addItem(newItem);
                    msg = addItem;
                    break;
                }*/
                case "PUT": {
                    // receive: body.id & body.updateItem
                    // return: only the new object inserted in DB
                    /*const body = JSON.parse(event.body);
                    const { id, updateItem } = body;
                    const changeItem = await db.updateItem(id, updateItem);
                    msg = changeItem;*/
                    
                    const userId = event.requestContext.authorizer.jwt.claims.sub;
    console.log("userId: ", userId, event.requestContext.authorizer.jwt.claims)
        const profiles = await getProfiles();
    
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Hello from Lambda PUTTTT!',
                receivedData: event.body,
                profiles
            }),
        };
        return response;
                }
    /*            case "DELETE": {
                    // receive: body.itemIdToBeDelete
                    // return: new list of items in DB
                    const body = JSON.parse(event.body);
                    const { itemIdToBeDelete } = body;
                    await db.removeItem(itemIdToBeDelete);
                    const newItemsList = await db.getAllItems();
                    msg = newItemsList;
                    break;
                }*/
                default:
                // Gateway API suppose to handle this before this point0
                    msg = "something wrong :(";
                    break
            }
        
            // this code is suppose to be not reachable
            const response = {
                statusCode: 200,
                body: JSON.stringify({message: "something happened..;"})
            };
            return response;
        } catch(err) {
            console.log("###ERROR - general error: ", err.message || err);
            return ({
                statusCode: 500,
                body: JSON.stringify({error: err.message || err})
            });
        }
    };
    