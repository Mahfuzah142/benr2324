   async function main(){
    /**
    * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
    * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
    */
    const uri = "mongodb+srv://nurmahfuzah03:Mahfuzah03@mahfuzah03.blu6t3a.mongodb.net/?retryWrites=true&w=majority&appName=Mahfuzah03";
    const client = new MongoClient(uri);
    try {
     // Connect the client to the server  (optional starting in v4.7)
     await client.connect();
     console.log('Connected successfully to MongoDB')
    await client.connect();
    [
        {
          '$match': {
            'name': 'Leslie Martinez'
          }
        }, {
          '$lookup': {
            'from': 'accounts', 
            'localField': 'accounts', 
            'foreignField': 'account_id', 
            'as': 'ACCOUNTRESULT'
          }
        }
      ]
    await listDatabases(client);
    } catch (e) {
    console.error(e);
    } finally {
    await client.close();
    }
   }
   main().catch(console.error);