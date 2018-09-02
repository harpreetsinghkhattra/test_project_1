import { MongoClient } from 'mongodb';

export class Connection {
    /** Mongodb connection */
    static connect(cb) {
        // let uri = "mongodb://127.0.0.1";
        let uri = "mongodb://harpreetsinghkhattra:Ha872909066@ds141952.mlab.com:41952/ishaanvi";

        MongoClient.connect(uri, (err, client) => {
            console.log('err', err);
            if (err) cb(err, null);
            if (client) {
                const db = client.db('ishaanvi');
                cb(null, db, client);
            }
        });
    }
}