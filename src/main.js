// as cursor is limited in the mongo shell, it's better to use an application to make complex queries and interactions

// using "type": "module" in package.json
import { MongoClient } from "mongodb";
import { students } from "./student.js";

// credentials should come from a more secure source instead of plain text
const url = "mongodb://rootuser:rootpass@localhost:27017/amigoscode/?authSource=admin";
const client = new MongoClient(url);

async function main() {
    try {
        await client.connect();
        console.log(`Connected to db ${url}`);
        // created db and collection via mongo shell
        const database = client.db("amigoscode");
        const studentCollection = database.collection("student");
        console.log("Trying to insert some students...");
        console.log(await studentCollection.insertMany(students));
        const femaleStudents = await studentCollection.find({$and: [{gender: "F"}, {isStudentActive: true}]}).toArray();
        for (const student of femaleStudents) {
            console.log(`Hello my name is ${student.firstName}!`);
        }
        console.log("Clearing up collection...")
        console.log(await studentCollection.deleteMany({}));
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

main().catch(console.error);